const User = require('../models/User');
const WasteLog = require('../models/WasteLog');

exports.getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Get logs count and breakdown
    const logs = await WasteLog.find({ userId });
    const logCount = logs.length;
    const wasteBreakdown = logs.reduce((acc, log) => {
      acc[log.type] = (acc[log.type] || 0) + log.quantity;
      return acc;
    }, {});
    // Simple eco-impact estimate
    const co2Saved = logs.reduce((acc, log) => acc + (log.type === 'Recycled' ? log.quantity * 0.5 : 0), 0);
    const wasteDiverted = logs.reduce((acc, log) => acc + log.quantity, 0);

    res.json({
      ecoPoints: user.ecoPoints,
      badges: user.badges,
      logCount,
      wasteBreakdown,
      co2Saved,
      wasteDiverted
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
