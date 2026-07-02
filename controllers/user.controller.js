const User = require("../models/user");

// 🔥 Obtener perfil del usuario autenticado
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('selectedTeam')
      .select('-googleId');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('❌ Error getting profile:', error);
    res.status(500).json({ error: 'Error getting profile' });
  }
};

// 🔥 Actualizar perfil (AUTO-GUARDADO)
exports.updateProfile = async (req, res) => {
  try {
    const { name, role, settings, preferences, selectedTeam } = req.body;

    // Construir objeto de actualización solo con campos que vinieron
    const updateData = {};
    
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (settings !== undefined) updateData.settings = settings;
    if (preferences !== undefined) updateData.preferences = preferences;
    if (selectedTeam !== undefined) updateData.selectedTeam = selectedTeam;

    updateData.lastUpdated = new Date();

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    ).populate('selectedTeam');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`✅ User ${user.email} updated successfully`);
    res.json({ 
      message: 'Profile updated',
      user 
    });
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
};

// 🔥 Actualizar solo settings (para auto-save más eficiente)
exports.updateSettings = async (req, res) => {
  try {
    const { darkMode, notificationsEnabled, language, theme, notifications } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          'settings.darkMode': darkMode !== undefined ? darkMode : undefined,
          'settings.notificationsEnabled': notificationsEnabled !== undefined ? notificationsEnabled : undefined,
          'settings.language': language || undefined,
          'preferences.theme': theme || undefined,
          'preferences.notifications': notifications || undefined,
          'lastUpdated': new Date()
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Settings updated', user });
  } catch (error) {
    console.error('❌ Error updating settings:', error);
    res.status(500).json({ error: 'Error updating settings' });
  }
};

// 🔥 Actualizar rol
exports.updateRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { role, lastUpdated: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`✅ Role updated for ${user.email}: ${role}`);
    res.json({ message: 'Role updated', user });
  } catch (error) {
    console.error('❌ Error updating role:', error);
    res.status(500).json({ error: 'Error updating role' });
  }
};

// 🔥 Actualizar equipo seleccionado
exports.updateSelectedTeam = async (req, res) => {
  try {
    const { teamId } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { selectedTeam: teamId || null, lastUpdated: new Date() },
      { new: true }
    ).populate('selectedTeam');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`✅ Selected team updated for ${user.email}`);
    res.json({ message: 'Team updated', user });
  } catch (error) {
    console.error('❌ Error updating team:', error);
    res.status(500).json({ error: 'Error updating team' });
  }
};
