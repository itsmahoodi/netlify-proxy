export default async (request, context) => {
  // گرفتن IP
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("client-ip") ||
    request.headers.get("x-real-ip");

  const url = new URL(request.url);
  const workerDomain = url.hostname;

  // تنظیم دامنه و پورت مقصد
  url.hostname = "sw1.mahoodi.sbs"; 
  url.port = "8443"; // پورت مقصد

  // تنظیم پروتکل
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  url.protocol = forwardedProto + ":";

  // ساخت یک Request جدید به سمت سرور مقصد
  const newRequest = new Request(url.toString(), request);

  const headers = new Headers(newRequest.headers);

  // تنظیم هدرهای مهم
  if (ip) {
    headers.set("cf-connecting-ip", ip); // اگر سرور مقصد این را می‌خواند
  }
  headers.set("Host", workerDomain);

  const finalRequest = new Request(newRequest, { headers });

  // ارسال به سرور مقصد
  return fetch(finalRequest);
};
