const EmailParserService = require('../services/EmailParserService');

// Parse order confirmation email
exports.parseEmail = async (req, res) => {
  try {
    const { emailContent } = req.body;

    if (!emailContent || !emailContent.trim()) {
      return res.status(400).json({
        error: 'Email content is required'
      });
    }

    const orderDetails = await EmailParserService.parseEmail(emailContent);

    if (!orderDetails) {
      return res.status(400).json({
        error: 'Could not parse order information from email'
      });
    }

    res.status(200).json({
      success: true,
      data: orderDetails
    });
  } catch (error) {
    console.error('Parse email error:', error);
    res.status(500).json({
      error: 'Failed to parse email',
      message: error.message
    });
  }
};
