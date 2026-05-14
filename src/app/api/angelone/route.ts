import { NextResponse } from "next/server";
import * as OTPAuth from "otpauth";
export async function GET() {
  try {
const apiKey = process.env.ANGELONE_API_KEY;

const secret = process.env.ANGELONE_TOTP_SECRET || "";

const totp = new OTPAuth.TOTP({
  issuer: "AngelOne",
  label: "SmartAPI",
  algorithm: "SHA1",
  digits: 6,
  period: 30,
  secret,
}).generate();

    const clientCode = process.env.ANGELONE_CLIENT_CODE;
    const mpin = process.env.ANGELONE_MPIN;
    

    const response = await fetch(
      "https://apiconnect.angelone.in/rest/auth/angelbroking/user/v1/loginByPassword",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-UserType": "USER",
          "X-SourceID": "WEB",
          "X-ClientLocalIP": "127.0.0.1",
          "X-ClientPublicIP": "127.0.0.1",
          "X-MACAddress": "00:00:00:00:00:00",
          "X-PrivateKey": apiKey || "",
        },
        body: JSON.stringify({
          clientcode: clientCode,
          password: mpin,
          totp: totp,
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      success: true,
      angelOneResponse: data,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
