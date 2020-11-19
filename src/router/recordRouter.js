import { Router } from "express";
import { getStudentList } from "../domain/record";

const router = Router();

router.get("/extract", (req, res) => {
  const { MACaddress } = req.params;
    getStudentList(MACaddress).then((students) => res.json(students));
  });


export default router;
