import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const SECRET_KEY = 'clave-secreta-demo'; // en producción, guardala en .env

export default async function handler(req, res) {
  const { username, password } = req.body;

  const USER_DB = {
    username: 'admin',
    passwordHash: await bcrypt.hash('123456', 10), // reemplazá luego por tu lógica real
  };

  const match = await bcrypt.compare(password, USER_DB.passwordHash);

  if (username === USER_DB.username && match) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '2h' });

    res.setHeader('Set-Cookie', serialize('auth_token', token, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 2,
    }));

    res.status(200).json({ ok: true });
  } else {
    res.status(401).json({ ok: false });
  }
}
