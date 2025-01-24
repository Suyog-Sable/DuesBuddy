const User = require('../models/user');
const Tenant = require('../models/tenant');

// Get Users by TenantId
exports.getUsersByTenantId = async (req, res) => {
  try {
    const { tenantId } = req.params;

    // Fetch the tenant with its associated users
    const tenant = await Tenant.findOne({
      where: { Id: tenantId },
      include: [ {
        model: User,
        required: true,
      }],
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found.' });
    }

    const response = {
      Id: tenant.Id,
      email: tenant.email,
      Users: tenant.Users.map(user => ({
        tenantId: user.tenantId,
        Id: user.Id,
        Name: user.Name,
        Wing: user.Wing,
        RoomNo: user.RoomNo,
        MobileNo: user.MobileNo,
        EmailId: user.EmailId,
        Gender: user.Gender,
        AadharImagePath: user.AadharImagePath,
        PermanentAddress: user.PermanentAddress,
        PresentAddress: user.PresentAddress,
        Location: user.Location,
        ProfileImagePath: user.ProfileImagePath,
        DOB: user.DOB,
        IsTrainer: user.IsTrainer,
        CreatedBy: user.CreatedBy,
        CreatedDate: user.CreatedDate,
        UpdatedBy: user.UpdatedBy,
        UpdatedDate: user.UpdatedDate,
        Extra1: user.Extra1,
        Extra2: user.Extra2,
        Extra3: user.Extra3,
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching tenant and users:', error);
    res.status(500).json({ error: error.message });
  }
};


// Get User by UserId and TenantId
exports.getUserByIdAndTenant = async (req, res) => {
  try {
    const { tenantId, Id } = req.params;

    const user = await User.findOne({
      where: { TenantId: tenantId, Id: Id },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found for this tenant.' });
    }

    const response = {
      Id: user.Id,
      Name: user.Name,
      Wing: user.Wing,
      RoomNo: user.RoomNo,
      MobileNo: user.MobileNo,
      EmailId: user.Email,
      Gender: user.Gender,
      AadharImagePath: user.AadharImagePath,
      PermanentAddress: user.PermanentAddress,
      PresentAddress: user.PresentAddress,
      Location: user.Location,
      ProfileImagePath: user.ProfileImagePath,
      DOB: user.DOB,
      IsTrainer: user.IsTrainer,
      CreatedBy: user.CreatedBy,
      CreatedDate: user.CreatedDate,
      UpdatedBy: user.UpdatedBy,
      UpdatedDate: user.UpdatedDate,
      Extra1: user.Extra1,
      Extra2: user.Extra2,
      Extra3: user.Extra3,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching user by tenant and user ID:', error);
    res.status(500).json({ error: error.message });
  }
};


// Create a new User for a specific TenantId
// Create User
exports.createUser = async (req, res) => {
  try {
    const { tenantId, Name, Wing, RoomNo, MobileNo, EmailId, Gender, DOB, IsTrainer } = req.body;

    console.log("Looking for tenantId:", tenantId);  // Log the tenantId being searched for

    const tenant = await Tenant.findOne({
      where: { Id: tenantId },  // Check if tenantId matches the 'Id' in the database
    });

    if (!tenant) {
      console.log("Tenant not found with Id:", tenantId);  // Log when tenant is not found
      return res.status(404).json({ message: 'Tenant not found.' });
    }

    // Create a new user associated with the tenant
    const user = await User.create({
      tenantId, 
      Name,
      Wing,
      RoomNo,
      MobileNo,
      EmailId,
      Gender,
      DOB,
      IsTrainer,
    });

    res.status(201).json({ message: 'User created successfully!', user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message });
  }
};




// Update User by UserId and TenantId
exports.updateUser = async (req, res) => {
  try {
    const { tenantId, userId } = req.params;
    const updatedData = req.body;

    const user = await User.findOne({ where: { TenantId: tenantId, UserId: userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await user.update(updatedData);

    const response = {
      Id: user.UserId,
      Name: user.Name,
      Wing: user.Wing,
      RoomNo: user.RoomNo,
      MobileNo: user.MobileNo,
      EmailId: user.EmailId,
      Gender: user.Gender,
      AadharImagePath: user.AadharImagePath,
      PermanentAddress: user.PermanentAddress,
      PresentAddress: user.PresentAddress,
      Location: user.Location,
      ProfileImagePath: user.ProfileImagePath,
      DOB: user.DOB,
      IsTrainer: user.IsTrainer,
      CreatedBy: user.CreatedBy,
      CreatedDate: user.CreatedDate,
      UpdatedBy: user.UpdatedBy,
      UpdatedDate: user.UpdatedDate,
      Extra1: user.Extra1,
      Extra2: user.Extra2,
      Extra3: user.Extra3,
    };

    res.status(200).json({ message: 'User updated successfully', user: response });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: error.message });
  }
};


// Delete User by UserId and TenantId
exports.deleteUser = async (req, res) => {
  try {
    const { tenantId, userId } = req.params;

    const user = await User.findOne({ where: { TenantId: tenantId, UserId: userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
};