import { PATHS } from "./AppRouter";

const PORT_FROM_WINDOW_VAR = window.location.port
  ? ":" + window.location.port
  : "";
const SERVER_PORT =
  process.env.NODE_ENV === "development" ? ":5000" : PORT_FROM_WINDOW_VAR;
const HOSTNAME =
  window.location.protocol + "//" + window.location.hostname + SERVER_PORT;
const JWT_TOKEN_KEY = "jwt-token";
export const Google_API =
 "445765554074-uoa1cp56olesgmb1p3j6grf9ejhjvr31.apps.googleusercontent.com";
export const Fb_Id = "902624663816840";

export const UNAUTHORIZED_STATUS = 401;

export async function auth_final(path, body){
  return fetch(HOSTNAME + path, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: body
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (responseJson) {
      localStorage.setItem(JWT_TOKEN_KEY, responseJson["access_token"])
    })
}

export async function authenticate(email, password) {
  const body = JSON.stringify({
    username: email,
    password: password,
  })
  return auth_final("/login/", body)
}

export async function authenticate_cas(ticket) {
  const body = JSON.stringify({
    ticket: ticket,
  })
  return auth_final("/login_cas/", body)
}

export async function authenticate_social(method, email, token) {
  const body = JSON.stringify({
    method: method,
    username: email,
    token: token,
  })
  return auth_final("/login_social/", body)
}

export async function logout() {
    localStorage.clear(JWT_TOKEN_KEY);
    onUnauthedDefault(new Response("{}"));
}

export function onUnauthedDefault(response) {
  const loginPage =
    window.location.protocol +
    "//" +
    window.location.hostname +
    PORT_FROM_WINDOW_VAR;
  const registrationPage = loginPage + PATHS.SIGNUP;
  const emailLoginPage = loginPage + PATHS.SIGNIN;
  const casRedirectionPage = loginPage + "/cas_auth/";
  if (
    window.location.href !== loginPage + "/" &&
    window.location.href !== registrationPage &&
    window.location.href !== emailLoginPage &&
    !window.location.href.includes(casRedirectionPage)
  ) {
    window.location.href = loginPage;
  }
  return response.json();
}

function authenticatedJsonRequest(
  uri,
  requestOptions,
  onUnauthedResponse = onUnauthedDefault
) {
  return fetch(HOSTNAME + uri, requestOptions).then(function (response) {
    if (response.status === UNAUTHORIZED_STATUS) {
      return onUnauthedResponse(response);
    } else {
      return response.text().then(function (text) {
        return text ? JSON.parse(text) : {};
      });
    }
  });
}

function getBaseAuthedRequestOptions() {
  return {
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      Authorization: "Bearer " + localStorage.getItem(JWT_TOKEN_KEY)
    }
  };
}

export async function authenticatedPostJson(uri, payload) {
  return authenticatedJsonRequest(uri, {
    ...getBaseAuthedRequestOptions(),
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function authenticatedPutJson(uri, payload) {
  return authenticatedJsonRequest(uri, {
    ...getBaseAuthedRequestOptions(),
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export async function authenticatedPatchJson(uri, payload) {
  return authenticatedJsonRequest(uri, {
    ...getBaseAuthedRequestOptions(),
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export async function authenticatedGetJson(
  uri,
  onUnauthedResponse = onUnauthedDefault
) {
  return authenticatedJsonRequest(
    uri,
    { ...getBaseAuthedRequestOptions(), method: "GET" },
    onUnauthedResponse
  );
}

export async function authenticatedDeleteJson(uri) {
  return authenticatedJsonRequest(uri, {
    ...getBaseAuthedRequestOptions(),
    method: "DELETE"
  });
}
