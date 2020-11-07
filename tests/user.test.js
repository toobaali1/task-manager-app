const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/modals/user")


const userOneID = new mongoose.Types.ObjectId;
const user1 = {
    _id: userOneID,
    name: "Hellen",
    email: "hellen@123.com",
    password: "test123456!",
    tokens: [{
        token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany();
    await new User(user1).save();
});

test("should signup a new user", async () => {
    const response = await request(app).post("/users").send({
        name: "Andrew",
        email: "andrew@123.com",
        password: "redblue1234!"
    }).expect(201)

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();
})

test("should login existing user", async () => {
    const response = await request(app).post("/users/login").send({
        email: user1.email,
        password: user1.password
    }).expect(200);

    const user = await User.findById(userOneID);

    expect(response.body).toMatchObject({
        token: user.tokens[1].token
    })
});

test("Should not login non-existent user", async () => {
    await request(app).post("/users/login").send({
        email: user1.email,
        password: "1234567!"
    }).expect(400)
});

test("should get profile for user", async () => {
    await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)
});

test("should not get profile for unathenticated user", async () => {
    await request(app)
        .get("/users/me")
        .send()
        .expect(401)
});

test("should delete authorized user", async () => {
    await request(app)
        .delete("/users/me")
        .set("Authorization", `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneID);
    expect(user).toBeNull();

});

test("should not delete account foe unauthorized users", async () => {
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401)
});