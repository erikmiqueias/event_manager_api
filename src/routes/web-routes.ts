import { Router } from "express";
import { PostgresGetUserByEmailRepository } from "../repositories/user/get-user-by-email";
import { GetUserByEmailController } from "../controllers/user/get-user-by-email";
import { authWithSession } from "../middlewares/auth";
import { CreateEventController } from "../controllers/event/create-event";
import { DeleteEventController } from "../controllers/event/delete-event";
import { EditEventByIdController } from "../controllers/event/edit-event-by-id";
import { GetEventIdByAccessCodeController } from "../controllers/event/get-event-id-by-access-code";
import { GetEventsByPaginationController } from "../controllers/event/get-events-by-pagination";
import { GetEventsByUserIdController } from "../controllers/event/get-events-by-user-id";
import { UserEventsRetrieverController } from "../controllers/event/get-user-events-retriever";
import { JoinEventController } from "../controllers/event/join-event";
import { CreateUserController } from "../controllers/user/create-user";
import { GetUserController } from "../controllers/user/get-user";
import { PostgresCreateEventRepository } from "../repositories/event/create-event";
import { PostgresDeleteAccessCodeRepository } from "../repositories/event/delete-access-code";
import { PostgresDeleteEventRepository } from "../repositories/event/delete-event";
import { PostgresEditEventByIdRepository } from "../repositories/event/edit-event-by-id";
import { PostgresGetEventByEventIdAndUserIdRepository } from "../repositories/event/get-event-by-event-id-and-user-id";
import { PostgresGetEventByIdRepository } from "../repositories/event/get-event-by-id";
import { PostgresGetEventIdByAccessCodeRepository } from "../repositories/event/get-event-id-by-access-code";
import { PostgresGetEventsByPaginationRepository } from "../repositories/event/get-events";
import { PostgresGetEventsByUserIdRepository } from "../repositories/event/get-events-by-user-id";
import { PostgresUserEventsRetrieverRepository } from "../repositories/event/get-user-events-retriever";
import { PostgresJoinEventRepository } from "../repositories/event/join-event";
import { PostgresCreateUserRepository } from "../repositories/user/create-user";
import { PostgresGetUserRepository } from "../repositories/user/get-user";
import upload from "../middlewares/multer";
import cloudinary from "../config/cloudinary";
import { unlinkSync } from "fs";
import express from "express";
import { PostgresEditUserByIdRepository } from "../repositories/user/edit-user";
import { EditUserByIdController } from "../controllers/user/edit-user-by-id-controller";
import { UploadFileIntoCloudinary } from "../repositories/user/upload-file";
export const webRouter = Router();

webRouter.use(express.json());

webRouter.post("/login", async (req, res) => {
  const getGetUserByEmailRepository = new PostgresGetUserByEmailRepository();
  const getUserByEmailController = new GetUserByEmailController(
    getGetUserByEmailRepository
  );

  const { body, statusCode } = await getUserByEmailController.getUserByEmail(
    req
  );

  if (!body) {
    return;
  }

  if (statusCode === 200 && typeof body !== "string") {
    (req.session as any).user = {
      id: body.id,
      userName: body.userName,
      email: body.email,
    };

    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");

    req.session.save((err) => {
      if (err) {
        throw err;
      }
      console.log("Session saved", req.sessionID);
      res.status(statusCode).send(body);
    });
  } else {
    res.status(statusCode).send(body);
  }
});

webRouter.post("/logout", authWithSession, (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ error: "Error destroying session" });
    }
    res.status(200).send({ message: "Logout successful" });
  });
});

// Rota para pegar um usuário
webRouter.get("/user/:id", authWithSession, async (req, res) => {
  const userIdFromParams = req.params.id;
  const userIdFromSession = (req.session as any).user?.id;

  if (userIdFromParams !== userIdFromSession) {
    res.status(401).send({ error: "Unauthorized" });
    return;
  }

  const getUserRepository = new PostgresGetUserRepository();
  const getUserController = new GetUserController(getUserRepository);
  const { body, statusCode } = await getUserController.getUser(req);

  res.status(statusCode).send(body);
});

// Rota para criação de usuário
webRouter.post("/user", async (req, res) => {
  console.log(req.body);
  const createUserRepository = new PostgresCreateUserRepository();
  const createUserController = new CreateUserController(createUserRepository);

  const { body, statusCode } = await createUserController.create(req);
  res.status(statusCode).send(body);
});

// Rota para criação de evento
webRouter.post("/event", authWithSession, async (req, res) => {
  const userIdFromSession = (req.session as any).user?.id;
  const userIdFromParams = req.body.userId;

  if (userIdFromParams !== userIdFromSession) {
    res.status(401).send({ error: "Unauthorized" });
    return;
  }

  console.log(req.body);

  const createEventRepository = new PostgresCreateEventRepository();
  const getUserRepository = new PostgresGetUserRepository();
  const createEventController = new CreateEventController(
    createEventRepository,
    getUserRepository
  );

  const { body, statusCode } = await createEventController.createEvent(req);

  res.status(statusCode).send(body);
});

// Rota para pegar os eventos criados por um usuário especifico
webRouter.get("/user/events/:userId", authWithSession, async (req, res) => {
  const userIdFromParams = req.params.userId;
  const userIdFromSession = (req.session as any).user?.id;

  if (userIdFromParams !== userIdFromSession) {
    res.status(401).send({ error: "Unauthorized" });
    return;
  }

  const getEventsByUserIdRepository = new PostgresGetEventsByUserIdRepository();
  const getEventsByUserIdController = new GetEventsByUserIdController(
    getEventsByUserIdRepository
  );

  const { body, statusCode } =
    await getEventsByUserIdController.getEventsByUserId(req);

  res.status(statusCode).send(body);
});

// Rota para pegar os eventos com paginação
webRouter.get("/events", async (req, res) => {
  const getEventsByPaginationRepository =
    new PostgresGetEventsByPaginationRepository();

  const getEventsByPaginationController = new GetEventsByPaginationController(
    getEventsByPaginationRepository
  );

  const { body, statusCode } =
    await getEventsByPaginationController.getEventsByPagination(req);

  res.status(statusCode).send(body);
});

// Rota para pegar o id de um evento pelo codigo de acesso
webRouter.get("/event/invite/:accessCode", async (req, res) => {
  const getEventByAccessCodeRepository =
    new PostgresGetEventIdByAccessCodeRepository();

  const getEventIdByAccessCodeController = new GetEventIdByAccessCodeController(
    getEventByAccessCodeRepository
  );

  const { body, statusCode } =
    await getEventIdByAccessCodeController.getEventById(req);

  res.status(statusCode).send(body);
});

// Rota para participar de um evento
webRouter.post("/event/:eventId/join", authWithSession, async (req, res) => {
  const userIdFromSession = (req.session as any).user?.id;
  const userIdFromParams = req.body.userId;

  console.log(req.body);

  if (userIdFromParams !== userIdFromSession) {
    res.status(401).send({ error: "Unauthorized" });
    return;
  }

  const joinEventRepository = new PostgresJoinEventRepository();
  const getUserRepository = new PostgresGetUserRepository();
  const getEventByIdRepository = new PostgresGetEventByIdRepository();
  const joinEventController = new JoinEventController(
    joinEventRepository,
    getUserRepository,
    getEventByIdRepository
  );

  const { body, statusCode } = await joinEventController.joinEvent(req);

  res.status(statusCode).send(body);
});

// Rota para verificar se o usuário está autenticado
webRouter.get("/api/auth/status", authWithSession, (req, res) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");

  res.send({
    authenticated: true,
    user: (req.session as any).user,
    sessionID: req.sessionID,
  });
});

// Rota para pegar os eventos que um usuário participou
webRouter.get(
  "/user/events/joined/:userId",
  authWithSession,
  async (req, res) => {
    const userIdFromParams = req.params.userId;
    const userIdFromSession = (req.session as any).user?.id;

    if (userIdFromParams !== userIdFromSession) {
      res.status(401).send({ error: "Unauthorized" });
      return;
    }

    const getUserEventsRetrieverRepository =
      new PostgresUserEventsRetrieverRepository();
    const getUserEventsRetrieverController = new UserEventsRetrieverController(
      getUserEventsRetrieverRepository
    );

    const { body, statusCode } =
      await getUserEventsRetrieverController.getUserEvents(req);

    res.status(statusCode).send(body);
  }
);

// Rota para deletar um evento
webRouter.delete("/user/event/:eventId", authWithSession, async (req, res) => {
  const userIdFromSession = (req.session as any).user?.id;

  if (!userIdFromSession) {
    res.status(401).send({ error: "Unauthorized" });
    return;
  }

  const deleteEventRepository = new PostgresDeleteEventRepository();
  const getEventByEventIdAndUserIdRepository =
    new PostgresGetEventByEventIdAndUserIdRepository();
  const deleteEventController = new DeleteEventController(
    deleteEventRepository,
    getEventByEventIdAndUserIdRepository
  );

  const { body, statusCode } = await deleteEventController.deleteEvent(req);

  res.status(statusCode).send(body);
});

webRouter.patch("/user/event/:eventId", authWithSession, async (req, res) => {
  const userIdFromSession = (req.session as any).user?.id;

  if (!userIdFromSession) {
    res.status(401).send({ error: "Unauthorized" });
    return;
  }

  console.log(req.body);

  const editEventByIdRepository = new PostgresEditEventByIdRepository();
  const getEventByIdRepository = new PostgresGetEventByIdRepository();
  const deleteAccessCodeRepository = new PostgresDeleteAccessCodeRepository();
  const editEventByIdController = new EditEventByIdController(
    editEventByIdRepository,
    getEventByIdRepository,
    deleteAccessCodeRepository
  );

  const { body, statusCode } = await editEventByIdController.editEventById(req);

  res.status(statusCode).send(body);
});

webRouter.patch(
  "/user/edit/:userId",
  upload.single("image"),
  authWithSession,
  async (req, res) => {
    const userIdFromSession = (req.session as any).user?.id;

    if (!userIdFromSession) {
      res.status(401).send({ error: "Unauthorized" });
      return;
    }

    console.log(req.body, req.file);

    const editUserByIdRepository = new PostgresEditUserByIdRepository();
    const uploadFileIntoCloudinary = new UploadFileIntoCloudinary();
    const getUserRepository = new PostgresGetUserRepository();
    const editUserByIdController = new EditUserByIdController(
      editUserByIdRepository,
      getUserRepository,
      uploadFileIntoCloudinary
    );

    const { body, statusCode } = await editUserByIdController.editUserById(req);

    res.status(statusCode).send(body);
  }
);
