# SmartRoom Backend — Phase 3A

Self-contained Node.js backend foundation for SmartRoom. It uses only Node built-ins so it can run on a phone with Termux, a PC, or a server.

## Run
1. Install Node.js 20+.
2. Copy `.env.example` to `.env` and set a long random `SMARTROOM_JWT_SECRET`.
3. Run `npm start`.
4. Open `http://127.0.0.1:8787/api/health`.

For Android/Termux, bind is `0.0.0.0`; use the phone's LAN IP from another device.

## Current API
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/me`
- CRUD: `/api/rooms`
- CRUD: `/api/devices`
- `POST /api/devices/:id/commands`
- CRUD: `/api/functions`
- CRUD: `/api/scenes`
- CRUD: `/api/automations`
- CRUD: `/api/schedules`
- CRUD: `/api/sensors`
- CRUD: `/api/esp32/nodes`
- `GET /api/events`

All non-auth routes require `Authorization: Bearer <token>`.

Important: this phase does not pretend to control physical hardware. Device commands are recorded as `requested_waiting_for_hardware_acknowledgement`. ESP32 transport and real acknowledgements come in the next phase.
