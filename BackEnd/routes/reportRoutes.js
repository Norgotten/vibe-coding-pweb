const express = require("express");
const Report = require("../models/Report");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth"); // <--- ini

const router = express.Router();

// GET satu laporan berdasarkan id (public)
router.get("/:id", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report tidak ditemukan" });
    }
    res.json(report);
  } catch (err) {
    console.error("Error get single report:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// POST buat laporan baru
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, description, room, urgency } = req.body;

    if (!title || !room) {
      return res.status(400).json({ message: "title dan room wajib diisi" });
    }

    const newReport = await Report.create({
        title,
        description,
        room,
        urgency: urgency || "Low",
        status: "Pending",
        imageUrl: req.file ? req.file.filename : null,
        userId: req.user.id,
    });

    res.status(201).json(newReport);
  } catch (err) {
    console.error("Error create report:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ PUT /api/reports/:id  (update laporan)
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;

    // field yang boleh diupdate
    const { title, description, room, urgency, status } = req.body;

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Report tidak ditemukan" });
    }

    if (title !== undefined) report.title = title;
    if (description !== undefined) report.description = description;
    if (room !== undefined) report.room = room;
    if (urgency !== undefined) report.urgency = urgency;
    if (status !== undefined) report.status = status;
    if (req.file) report.imageUrl = req.file.filename;

    const updated = await report.save();

    res.json(updated);
  } catch (err) {
    console.error("Error update report:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ DELETE /api/reports/:id (hapus laporan)
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Report tidak ditemukan" });
    }

    await report.deleteOne();

    // 204 = no content
    res.status(204).send();
  } catch (err) {
    console.error("Error delete report:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
