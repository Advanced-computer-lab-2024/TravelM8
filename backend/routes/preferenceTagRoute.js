import expresss from "express";
import {
  createPreferenceTag,
  getAllPreferenceTags,
  updatePreferenceTag,
  deletePreferenceTag,
} from "../controllers/preferenceTagController.js";

const router = expresss.Router();

router.post("/preference-tags", createPreferenceTag);
router.get("/preference-tags", getAllPreferenceTags);
router.put("/preference-tags/:id", updatePreferenceTag);
router.delete("/preference-tags/:id", deletePreferenceTag);



export default router;
