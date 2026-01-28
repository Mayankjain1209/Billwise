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
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and PDF are allowed.'));
    }
  }
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
      message: error.message
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

      // Validate amount
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({
          error: "Amount must be a positive number",
        });
      }

      // Validate date
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          error: "Invalid date format",
        });
      }

      const bill = await prisma.bill.create({
        data: {
          userId: req.user.id,
          type,
          amount: parsedAmount,
          date: parsedDate,
          fileName: req.file.originalname,
          metadata: JSON.stringify({
            instruction: userInstruction || "",
            mimeType: req.file.mimetype,
            size: req.file.size,
            uploadedAt: new Date().toISOString()
          }),
        },
      });

      res.status(201).json({ 
        bill,
        message: "Bill uploaded successfully"
      });
    } catch (error) {
      console.error("❌ Upload bill error:", error);
      res.status(500).json({
        error: "Failed to upload bill",
        message: error.message
      });
    }
  }
);

/* ================================
   GET SINGLE BILL
   ================================ */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const bill = await prisma.bill.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!bill) {
      return res.status(404).json({ error: "Bill not found" });
    }

    res.json({ bill });
  } catch (error) {
    console.error("❌ Get bill error:", error);
    res.status(500).json({
      error: "Failed to fetch bill",
      message: error.message
    });
  }
});

/* ================================
   DELETE BILL
   ================================ */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const bill = await prisma.bill.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!bill) {
      return res.status(404).json({ error: "Bill not found" });
    }

    await prisma.bill.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Bill deleted successfully" });
  } catch (error) {
    console.error("❌ Delete bill error:", error);
    res.status(500).json({
      error: "Failed to delete bill",
      message: error.message
    });
  }
});

export default router;
