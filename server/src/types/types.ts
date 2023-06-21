

// user object returned to client
export type res_user = {
  id: string,
  name: string,
  email: string,
  createdAt: Date,
}

export type req_user = {
  name: string,
  email: string,
  password: string,
}

// /register : register
export type res_register = {
  success: boolean,
  user: res_user
}

// token-payload type
export type token_payload = {
  id: string,
  email: string,
}

// /login request data
export type req_login = {
  email: string,
  password: string,
}