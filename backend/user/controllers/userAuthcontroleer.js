export const sendPropertyInquiry = async (req, res) => {
  try {
    const {
      clientEmail,
      propertyTitle,
      userEmail,
      message
    } = req.body || {};

    if (!clientEmail) {
      return res.status(400).json({
        success: false,
        message: "Client email is required"
      });
    }

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email is required"
      });
    }

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    await sendPropertyInquiryEmail({
      clientEmail,
      propertyTitle,
      userEmail,
      message
    });

    return res.status(200).json({
      success: true,
      message: "Message sent to the property client successfully"
    });

  } catch (error) {
    console.error("Send property inquiry error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message to client"
    });
  }
};