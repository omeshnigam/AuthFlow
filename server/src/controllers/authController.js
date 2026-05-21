import User from "../models/User.js";
import {
  hashToken,
  refreshCookieOptions,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../utils/tokenUtils.js";

const attachRefreshToken = async (res, user) => {
  const refreshToken = signRefreshToken(user);
  user.refreshTokenHash = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });
  res.cookie("refreshToken", refreshToken, refreshCookieOptions());
};

const sendAuthResponse = async (res, user, statusCode = 200) => {
  await attachRefreshToken(res, user);

  res.status(statusCode).json({
    accessToken: signAccessToken(user),
    user: user.toSafeJSON()
  });
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const user = await User.create({ name, email, password });
    await sendAuthResponse(res, user, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password +refreshTokenHash");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    user.lastLoginAt = new Date();
    await sendAuthResponse(res, user);
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Refresh token is missing" });
    }

    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.sub).select("+refreshTokenHash");

    if (!user || user.refreshTokenHash !== hashToken(token)) {
      res.clearCookie("refreshToken", refreshCookieOptions());
      return res.status(401).json({ message: "Refresh token is invalid" });
    }

    await attachRefreshToken(res, user);

    res.json({
      accessToken: signAccessToken(user),
      user: user.toSafeJSON()
    });
  } catch (_error) {
    res.clearCookie("refreshToken", refreshCookieOptions());
    res.status(401).json({ message: "Refresh token is invalid or expired" });
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      try {
        const payload = verifyRefreshToken(token);
        await User.findByIdAndUpdate(payload.sub, { $unset: { refreshTokenHash: "" } });
      } catch (_error) {
        // A malformed or expired refresh token should still clear the browser cookie.
      }
    }

    res.clearCookie("refreshToken", refreshCookieOptions());
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
