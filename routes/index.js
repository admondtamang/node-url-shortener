import express from "express";
import Url from "../models/Url.js";

import { execSync } from "child_process";
const router = express.Router();

router.get("/:urlId", async (req, res) => {
  try {
    const cmd = `curl -s http://checkip.amazonaws.com || printf "0.0.0.0"`;
    const ip = execSync(cmd).toString().trim();

    const url = await Url.findOne({ urlId: req.params.urlId });
    if (url) {
      await Url.updateOne(
        {
          urlId: req.params.urlId,
        },
        { $inc: { clicks: 1 }, $push: { ip } }
      );
      return res.redirect(url.origUrl);
    } else res.status(404).json("Not found");
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

export default router;
