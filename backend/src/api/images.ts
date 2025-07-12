import { Router } from "express";
import { AppDataSource } from "../datasource";
import { Image } from "../entities/Image";
import logger from "../helpers/logger";

const router = Router();

// Get image by ID
router.get("/:id", async (req, res) => {
  try {
    const imageId = req.params.id;
    const imageRepository = AppDataSource.getRepository(Image);
    
    const image = await imageRepository.findOne({
      where: { id: imageId }
    });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found"
      });
    }

    // Return base64 image data
    return res.status(200).json({
      success: true,
      message: "Image retrieved successfully",
      data: {
        id: image.id,
        bufferString: image.bufferString
      }
    });
  } catch (error) {
    logger.error("Get image error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching image"
    });
  }
});

export default router;
