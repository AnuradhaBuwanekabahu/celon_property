export const getApplicableLimit = async (connection, clientId) => {
  const parsedClientId = Number(clientId);

  if (!Number.isInteger(parsedClientId) || parsedClientId <= 0) {
    throw new Error('Valid client id is required.');
  }

  const [clientRows] = await connection.query('SELECT total_ads_count FROM clients WHERE id = ? FOR UPDATE', [parsedClientId]);

  if (!clientRows.length) {
    throw new Error('Client not found.');
  }

  const currentCount = Number(clientRows[0].total_ads_count || 0);
  const nextAdIndex = currentCount + 1;

  const [limitRows] = await connection.query(
    'SELECT * FROM limits ORDER BY tier_order ASC, id ASC'
  );

  if (!limitRows.length) {
    throw new Error('No ad limit tiers are configured.');
  }

  const applicableLimit = limitRows.find(
    (limit) => Number(limit.limit_count) >= nextAdIndex
  );

  if (!applicableLimit) {
    const error = new Error('No ad limit tier is available for this client.');
    error.code = 'NO_TIER_AVAILABLE';
    throw error;
  }

  return {
    currentCount,
    nextAdIndex,
    applicableLimit,
  };
};

export const publicLimitInfo = (limit) => ({
  price: Number(limit.price || 0),
  days: Number(limit.days || 0),
});
