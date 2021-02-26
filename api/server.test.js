const request = require("supertest");
const db = require("../data/dbConfig.js");
const server = require("./server.js");

beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
});

beforeEach(async () => {
    await db("users").truncate();
});

afterAll(async (done) => {
    await db.destroy();
    done();
});

const mockUser = {
    username: "Jean",
    password: "myrealpw",
};

describe("server", () => {
    describe("[POST] /register", () => {
        beforeEach(async () => {
            await db("users").truncate();
        });
        it("Should create a new user", async () => {
            await request(server).post("/api/auth/register").send(mockUser);
            const user = await db("users").first();
            expect(user).toHaveProperty("id");
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("password");
        });

        it("Returns correct status code on duplicate", async () => {
            await request(server).post("/api/auth/register").send(mockUser);
            await request(server)
                .post("/api/auth/register")
                .send(mockUser)
                .expect(500);
        });
    });

    describe("[POST] /login", () => {
        it("Token is returned upon registration", async () => {
            await request(server).post("/api/auth/register").send(mockUser);
            let res = await request(server)
                .post("/api/auth/login")
                .send(mockUser);

            expect(res.body.token).toBeDefined();
        });
    });

    describe("[GET] /jokes", () => {
        it("User can login and view jokes", async () => {
            await request(server).post("/api/auth/register").send(mockUser);
            let res = await request(server)
                .post("/api/auth/login")
                .send(mockUser);

            await request(server)
                .get("/api/jokes")
                .set("Authorization", res.body.token)
                .expect(200);
        });
    });
});
