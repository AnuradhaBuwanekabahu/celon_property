import db from "../../configuration/db.js"
import { getApplicableLimit, publicLimitInfo } from '../utils/limitUtils.js'

const parseJSONSafe = (value) => {
    if (typeof value !== 'string') return value;

    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

// Add Hot Sale Property
export const addHotSale = async (req, res) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const {
            client_id,
            title,
            description,
            price,
            property_type,
            rate,
            duration,
            paid,
            overview,
            highlights,
            area_sqft,
            district,
            city,
            address,
            map_address,
            days
        } = req.body;

        const normalizedClientId = client_id && String(client_id).trim() !== ''
            ? Number(client_id)
            : null;

        const mainImageBuffer = req.files?.main_image?.[0]?.buffer ?? null;
        const mainVideoBuffer = req.files?.main_video?.[0]?.buffer ?? null;

        if (!normalizedClientId) {
            await connection.rollback();
            return res.status(401).json({
                message: "Please log in before adding a property."
            });
        }

        if (!mainImageBuffer) {
            await connection.rollback();
            return res.status(400).json({
                message: "Main image is required"
            });
        }

        const limitInfo = await getApplicableLimit(connection, normalizedClientId);
        const listingDays = Number(limitInfo.applicableLimit.days);
        const expiresAt = new Date(Date.now() + (listingDays * 24 * 60 * 60 * 1000));
        const listingStatus = Number(limitInfo.applicableLimit.price) > 0 ? 'pending' : 'active';

        const [result] = await connection.query(
            `
            INSERT INTO hot_sales
            (
                client_id,
                limit_id,
                title,
                description,
                price,
                property_type,
                rate,
                duration,
                highlights,
                overview,
                area_sqft,
                district,
                city,
                address,
                map_address,
                selected_days,
                expires_at,
                status,
                main_video,
                main_image
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                normalizedClientId,
                limitInfo.applicableLimit.id,
                title,
                description || null,
                price,
                property_type,
                rate || null,
                duration || 'month',
                highlights ? JSON.stringify(highlights) : null,
                overview ? JSON.stringify(overview) : null,
                area_sqft || null,
                district,
                city,
                address,
                map_address || null,
                listingDays,
                expiresAt,
                listingStatus,
                mainVideoBuffer,
                mainImageBuffer
            ]
        );

        const hotSaleId = result.insertId;

        // Insert additional images before finalizing the transaction.
        if (req.files?.images) {
            for (const image of req.files.images) {
                await connection.query(
                    `
                    INSERT INTO hot_sale_images
                    (
                        hot_sale_id,
                        image
                    )
                    VALUES (?, ?)
                    `,
                    [hotSaleId, image.buffer]
                );
            }
        }

        if (Number(limitInfo.applicableLimit.price) > 0) {
            const [paymentResult] = await connection.query(
                `INSERT INTO payments (client_id, property_type, property_id, amount, status, created_at)
                 VALUES (?, 'hot_sales', ?, ?, 'pending', NOW())`,
                [normalizedClientId, hotSaleId, Number(limitInfo.applicableLimit.price)]
            );

            await connection.commit();
            return res.status(201).json({
                message: 'Hot sale added successfully and payment is pending',
                id: hotSaleId,
                paymentId: paymentResult.insertId,
                status: 'pending',
                tier: publicLimitInfo(limitInfo.applicableLimit)
            });
        }

        await connection.query(
            `UPDATE clients SET total_ads_count = total_ads_count + 1 WHERE id = ?`,
            [normalizedClientId]
        );

        await connection.commit();
        res.status(201).json({ message: "Hot sale added successfully", id: hotSaleId, status: listingStatus, tier: publicLimitInfo(limitInfo.applicableLimit) });

    } catch (error) {
        try {
            await connection.rollback();
        } catch (rollbackError) {
            console.error("HOT SALE ROLLBACK ERROR:", rollbackError);
        }
        console.log(error);
        res.status(error.code === 'NO_TIER_AVAILABLE' ? 409 : 500).json({ message: error.message || "Internal server error" });
    } finally {
        connection.release();
    }
};

// Get All Hot Sales
export const showallhotsales = async (req, res) => {
    try {
        const [hotSales] = await db.query(
            `
            SELECT
                id,
                client_id,
                title,
                description,
                price,
                property_type,
                rate,
                duration,
                highlights,
                overview,
                area_sqft,
                district,
                city,
                address,
                map_address,
                main_video,
                main_image,
                selected_days AS days,
                CASE
                    WHEN expires_at IS NULL THEN NULL
                    WHEN DATEDIFF(expires_at, CURRENT_TIMESTAMP) < 0 THEN 0
                    ELSE DATEDIFF(expires_at, CURRENT_TIMESTAMP)
                END AS remaining_days,
                (expires_at IS NOT NULL AND DATEDIFF(expires_at, CURRENT_TIMESTAMP) <= 0 AND status <> 'expired') AS needs_expiry_update,
                status,
                created_at,
                updated_at
            FROM hot_sales
            ORDER BY created_at DESC
            `
        );

        const salesWithImages = await Promise.all(
            hotSales.map(async (sale) => {
                const [images] = await db.query(
                    `SELECT id FROM hot_sale_images WHERE hot_sale_id = ?`,
                    [sale.id]
                );

                const overview = sale.overview ? parseJSONSafe(sale.overview) : [];
                const highlights = sale.highlights ? parseJSONSafe(sale.highlights) : [];

                return {
                    ...sale,
                    overview,
                    highlights,
                    main_image: sale.main_image
                        ? `data:image/jpeg;base64,${Buffer.from(sale.main_image).toString('base64')}`
                        : null,
                    main_video: sale.main_video
                        ? `data:video/mp4;base64,${Buffer.from(sale.main_video).toString('base64')}`
                        : null,
                    images: images.map((img) => `/api/hot-sales/image/${img.id}`)
                };
            })
        );

        res.status(200).json({ message: "Hot sales fetched successfully", hotSales: salesWithImages });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const getHotSales = async (req, res) => {
    return showallhotsales(req, res);
};

// Get Single Hot Sale Property
export const getHotSaleById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Hot sale id is required" });
    }

    try {
        const [result] = await db.query(
            `
            SELECT
                id,
                client_id,
                title,
                description,
                price,
                property_type,
                rate,
                duration,
                highlights,
                overview,
                area_sqft,
                district,
                city,
                address,
                map_address,
                main_video,
                main_image,
                selected_days AS days,
                status,
                created_at,
                updated_at
            FROM hot_sales
            WHERE id = ?
            `,
            [id]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "Hot sale not found" });
        }

        const sale = result[0];
        const [images] = await db.query(
            `SELECT image FROM hot_sale_images WHERE hot_sale_id = ?`,
            [id]
        );

        const property = {
            ...sale,
            overview: sale.overview ? parseJSONSafe(sale.overview) : [],
            highlights: sale.highlights ? parseJSONSafe(sale.highlights) : [],
            main_image: sale.main_image
                ? `data:image/jpeg;base64,${Buffer.from(sale.main_image).toString('base64')}`
                : null,
            main_video: sale.main_video
                ? `data:video/mp4;base64,${Buffer.from(sale.main_video).toString('base64')}`
                : null,
            gallery_images: images.map((img) =>
                img.image
                    ? `data:image/jpeg;base64,${Buffer.from(img.image).toString('base64')}`
                    : null
            )
        };

        res.status(200).json(property);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Delete Hot Sale Property
export const deleteHotSale = async (req, res) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Hot sale id is required"
            });
        }

        const [existing] = await connection.query(
            `SELECT id FROM hot_sales WHERE id = ?`,
            [id]
        );

        if (existing.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                message: "Hot sale not found"
            });
        }

        // Remove additional images first (in case FK isn't set to cascade)
        await connection.query(
            `DELETE FROM hot_sale_images WHERE hot_sale_id = ?`,
            [id]
        );

        await connection.query(
            `DELETE FROM hot_sales WHERE id = ?`,
            [id]
        );

        await connection.commit();
        res.status(200).json({ message: "Hot sale deleted successfully" });

    } catch (error) {
        await connection.rollback();
        console.log(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    } finally {
        connection.release();
    }
};

// Edit Hot Sale Property
export const editHotSale = async (req, res) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Hot sale id is required"
            });
        }

        const [existing] = await connection.query(
            `SELECT * FROM hot_sales WHERE id = ?`,
            [id]
        );

        if (existing.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                message: "Hot sale not found"
            });
        }

        const current = existing[0];

        const {
            title,
            description,
            price,
            property_type,
            rate,
            duration,
            overview,
            highlights,
            area_sqft,
            district,
            city,
            address,
            map_address,
            status
        } = req.body;

        const rateValue = rate === '' ? current.rate : rate;
        const priceValue = price === '' ? current.price : price;
        const areaSqftValue = area_sqft === '' ? current.area_sqft : area_sqft;

        const mainImageBuffer = req.files?.main_image?.[0]?.buffer ?? null;
        const mainVideoBuffer = req.files?.main_video?.[0]?.buffer ?? null;

        await connection.query(
            `
            UPDATE hot_sales
            SET
                title = ?,
                description = ?,
                price = ?,
                property_type = ?,
                rate = ?,
                duration = ?,
                highlights = ?,
                overview = ?,
                area_sqft = ?,
                district = ?,
                city = ?,
                address = ?,
                map_address = ?,
                status = ?,
                main_image = ?,
                main_video = ?
            WHERE id = ?
            `,
            [
                title ?? current.title,
                description ?? current.description,
                priceValue,
                property_type ?? current.property_type,
                rateValue,
                duration ?? current.duration,
                highlights ? JSON.stringify(highlights) : current.highlights,
                overview ? JSON.stringify(overview) : current.overview,
                areaSqftValue,
                district ?? current.district,
                city ?? current.city,
                address ?? current.address,
                map_address ?? current.map_address,
                status ?? current.status,
                mainImageBuffer ?? current.main_image,
                mainVideoBuffer ?? current.main_video,
                id
            ]
        );

        // Replace additional images only if new ones were uploaded
        if (req.files?.images) {
            await connection.query(
                `DELETE FROM hot_sale_images WHERE hot_sale_id = ?`,
                [id]
            );

            for (const image of req.files.images) {
                await connection.query(
                    `
                    INSERT INTO hot_sale_images
                    (
                        hot_sale_id,
                        image
                    )
                    VALUES (?, ?)
                    `,
                    [id, image.buffer]
                );
            }
        }

        await connection.commit();
        res.status(200).json({ message: "Hot sale updated successfully" });

    } catch (error) {
        await connection.rollback();
        console.log(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    } finally {
        connection.release();
    }
};