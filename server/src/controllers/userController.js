export const getProfile = (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio } = req.body;

    if (typeof name === "string") {
      req.user.name = name.trim();
    }

    if (typeof bio === "string") {
      req.user.bio = bio.trim();
    }

    await req.user.save();
    res.json({ user: req.user.toSafeJSON() });
  } catch (error) {
    next(error);
  }
};
