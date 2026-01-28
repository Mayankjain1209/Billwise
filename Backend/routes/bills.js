import express from "express";
import multer from "multer";
import prisma from "../services/prisma.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/* ================================
   MULTER CONFIG (MEMORY STORAGE)
   ================================ */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

/* ================================
   GET ALL BILLS (DASHBOARD)
   ================================ */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bills = await prisma.bill.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        date: "desc",
      },
    });

    res.json({ bills });
  } catch (error) {
    console.error("❌ Fetch bills error:", error);
    res.status(500).json({
      error: "Failed to fetch bills",
    });
  }
});

/* ================================
   UPLOAD BILL
   ================================ */
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      const { type, amount, date, userInstruction } = req.body;

      // Basic validation
      if (!req.file) {
        return res.status(400).json({
          error: "File is required",
        });
      }

      if (!type || !amount || !date) {
        return res.status(400).json({
          error: "Type, amount, and date are required",
        });
      }

      const bill = await prisma.bill.create({
        data: {
          userId: req.user.id,
          type,
          amount: Number(amount),
          date: new Date(date),
          fileName: req.file.originalname,
          metadata: JSON.stringify({
            instruction: userInstruction || "",
            mimeType: req.file.mimetype,
            size: req.file.size,
          }),
        },
      });

      res.status(201).json({ bill });
    } catch (error) {
      console.error("❌ Upload bill error:", error);
      res.status(500).json({
        error: "Failed to upload bill",
      });
    }
  }
);

export default router;
