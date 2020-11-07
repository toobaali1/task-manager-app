const express = require("express");
const Task = require("../modals/task");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            author: req.user._id
        });

        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.send(400).send(e);
    }
});

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get("/tasks", auth, async (req, res) => {

    const match = {};
    const sort = {};

    if (req.query.completed) {
        match.completed = req.query.completed === "true"
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;

    }

    try {
        await req.user.populate({
            path: "usersTasks",
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }

        }).execPopulate();
        res.send(req.user.usersTasks);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const foundTask = await Task.findOne({ _id, author: req.user._id });
        if (!foundTask) {
            return res.status(404).send();
        }

        res.send(foundTask);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.patch("/tasks/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
        res.status(400).send({ error: "Invalid Updates" });
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, author: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();

        res.send(task);

    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, author: req.user._id });

        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;