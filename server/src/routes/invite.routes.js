import {Router} from "express"
import { 
  generateInviteCode, 
  joinProjectWithCode, 
  getProjectInviteCodes, 
  deactivateInviteCode 
} from '../controllers/invite.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/genrate").post(verifyJWT, generateInviteCode)
router.route("/join").post(verifyJWT, joinProjectWithCode)
router.route("/project:projectId").get(verifyJWT, getProjectInviteCodes)
router.route("/:codeId").delete(verifyJWT, deactivateInviteCode)

export default router;
