const fs = require("fs");
const crypto = require("crypto");
const axios = require("axios");
const FormData = require("form-data");

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1MrwItyy6IPNLSJbz1b53TGOTS2JBLTyg46Ql9xZpI6w/gviz/tq?tqx=out:csv&sheet=PinterestQueue";

const BASE_HOST = "https://in.pinterest.com";

// =====================================================================
// ☁️ CLOUDINARY CONFIG
// =====================================================================
const CLOUD_NAME = "djlipqlut";
const BANNER_WIDTH = 380;
const BANNER_GRAVITY = "north_west";
const BANNER_MARGIN_X = 10;
const BANNER_MARGIN_Y = 40;

// =====================================================================
// 🏊‍♂️ PINTEREST ACCOUNTS POOL
// =====================================================================
const PINTEREST_ACCOUNTS_POOL = [
  {
    name: "ania sharma",
    tagPrefix: "a",
    sticker: "pinsticker_a",
    cookieStr: `_auth=1; _pinterest_sess=TWc9PSYyRnRtWlk4ZUNMNTRyV0ZpbGZTSDdySko2L09YRkMvNXVpdVhXR1pqNUZWR2RaVWdyNGlPK1BMdGhhOWo1ZDNJaGJmRjNXZTk2UU12cHQxVExMTHdlTWhadkp0Z1pnVmgwMEV2ajVIOWFqNEJpUjhHWmtOcW1YT1NRa1J5NkdyaXA4WnZxR3dMSy9NSW9zcWI3UWtlL3Q5UHN5cWlMekl6RzFqUUxHanZlRTNobXJ1NGtxT1RWcTRhQW5MYjBDbTN0Y29qSTg1R1h4ZmY1MXBHQ0t2MEJtNVIxL2dyNG94enNyYm1uODVCb3RxTi93KzFzbTB5RWpDdDVvamdsY1owcjFHNUNJc0xPbFBaOWR3REJlNzl3UkxuWWVNaFRZbTdySW1IYjNTTlNCVFd0ZHBVM3lPSklZYVA3VlU1bWdVTXQwSUxONjNJZXJoT2E5VDE0ZENla3lmUXhqNWRWUUpNZiszN3VpR28wZWhCaTR1RUpRN2E3WFoxb0ZmenAzOGQ1eWo1Yi9sd2Ewamp0SGVpbGh2S2wydEV2ZjllYS9jR1RGMU1rbVpEclR6ajk1ekYyaXJsdXlVbnJ5YjJZUWdpbDJuZjJKZHZRa3VsMENhNm1iUkZvVWs4ZUMyb2V0azhFYi9DVUQrbG1WZ29qQlE2SjNwKzFkbCt6Z0FtaHlmMDNaOEtDZnZDTll4WEhJTHRYWWYzSnk2QUFoKzJiSlN3bXZRb2F6Tk1UMFl1SVVzZ0FKTWFNd0NjYTlQM1ZSb0g1SGZQbTgvV3ZGNnZrTm1ud0ZUUzVGaVA3SEYrUVVYb2ExUFJ1ZDZTVjBvdFU5dVpYMWVtSVNmS3JCakhKMU9WRlBibEVDL3pVeEhTKzMzSWliMStQSytHb04ybGRkRHgvSHpXelBOMnB3NDVESGwyYVkwd3VNeENCZm0za2RuNnR6S3hKNHg3NG9pOGdmZ2UyVXh3aDNoTS9QWmhLVW1RVmtjU1pYcVh0bmVjbWt3QUJRVTA4ai95YjlxcnorOGZOUnJSR2RSOWNJZS9DZ1RWUGtMT2Q5SFh4Tk42eFlza0lWM284bDdxZUo1NGdjNkkyWTY3dGgvZnl0cElWZnErMm05SE9LNWdTMUpleHB1SWVZeTc3MU14QkFzOWE0dFZrOGNja2o3U2IwZG4wd2ZhR2ZuOWtXNWZNK1kwMXRObTR3TVV3eGtTSSttbm9VTDloUEFyVk9Tdkg1UmtKOHhFMmhyNWhOYnV1a3liYVkrQm4yYmhGamNyd0ZrTkFlNVBlRFpDeTdCVkNlRHFVZ1plelV0eldrRmVqZWZkMmZxOHpja2JLZnRkQk94NXV6bWRBRi9tZ3BZMEhoZlFqL2E5bVdKL2ZVN05hQ1M5TFpRNUNiZWJhRzJIaGRyU2xLMUNTQ1RJMG5KNDFJQ21CL2tYM2pzK0NrcHloZGZKaitqcERvRHZQSU1scXM2RlpORXNJNXlpUXQrbDNGcXVmY3AxcC9JbklaSFV6RHR4d1ZjZ3c1RndrczlycFB4VVRqdGhUZVpkbTdQQ0pMajArcFZFMWhFdUtIV211V0JyVG9OOE8rdUN3TE5iV1gyTE5SK014OEltNnVuaWRQcXNrQktTc1BESmRXakxGMGUxbTlNWWZyQzhhTmVNbC9EYzNUU0FPVDdKMEs1dlZNUDQ3MkpaTHhkSllqRTNOYkoxN1U1cjZ2NDNpb2VIZkJBZFcxbVNhV0dPV2tsTUFvTTc2Y04wSTBaUDdSUHczU1d3dVZwM2pRdGpncnZFSDZFWmhGemkmWm8va3pNcm5xVFp0aXVCekFIY2k2djN3QXJJPQ==; l_o=kiEa7Mb9mVgg/N06ODd0M6HDatZtOVDzyW1MTcZp26mUe6qd2N87tD712lJ9Ih7M6wKKiAc1djWnLvfZ1wOSLZPysu/zUmwIob6R/mHLd9ntnr+Gkxv7+6LqVhB7V6uAweOG; __Secure-s_a=UnhvVVlHTy9zaEhjTnR3eENxTkJYTEdhZktaZEFmWE1ZRFMwUWhtd1JDNFhjK1hUdGtjNzNpaXFaek1udklZYjkwVklIaG1XaEc1ZkJCSmpZM0pxSzg5bTVWRkZTM1FubW9HT1lSVlVndWdMdk1FWjRGZkpnSi9QWVZSNHZMUnpUR3FEdDhBU1FGZGdOZXZvQWg4WGJCSkZTV3RrZ3plT1lmZFVQUzRrVUhkSkdUdVZtalB2OGVDK1k3YkxYc0xWNTIxQXBvdExycWVpWENEM0xlWkJWdEJaTHo4Zm95YzFRRXhhUlRyNnZVYUI2TXphQy9JeUYyQkFTbXpHTkhySitHd242N0RraGFCNEw1RGVheUFHSE41bkxKcTN1V2l0dlI2UlAvNEs3VlQxTkFuRzcwbWJZY2RJNGtaUUNCWUxaaWxiK0ZPbVppZWYydkZNUFYzakhCclp2NnBwYjhrNWtFZUFTVnM3eWt4N2hrY2V0NjUzZU05UHg5WEp2cGlKYVdlaXFRTFB4YlkvcW9mNjRkNTdqSkdiRE9NdEloc3VHeTNnREkxRUY3MjR3SUN5bjVXN0ZSRlJkRzFEUjdLSCthZTFYRUg4SVNVOXlXbVMyNWo3RVhPQ1VrN1pVZC92RjVEKzFMVHo2UUNaNHhreEtsRUd3ek5JdFNidmFIZ1VIcU1KbW1lWW9id2dIUUUrcFhDY2FMTFVvQWlaNWhJWDFRbFhFNlRzRnNWR0xzbGovVDZaWWdBZ3NYOUhSZHRGVjdaRjJqeTZRL0dURlVKYlpxVVFEWndkaXhrWWJOam9BOVVucXR2RVo3Yy9lVG8zdTloTXZ6ZlR5VzMxeTM4RE5rcXNaQmI4ZW5Bd1hoOWZ5Q2wyYmwwMXY3TnZMRzArWHpzSWFmMkJTOXphOTdzeE0yemF6VGp2c2hxRVpNbkszalFZUURGMGQzK2t0NS9EWFM3ejdBeWF2a3g3YnF6dHZyS3BmWDlYL29yWGFaZC9MR2ZnWE5oM1J5bFVzZVZtV1FMWlorUWdwbzRwQzBEMk5CMi82TlN0M0hhQy9VMVhmYXJnRS9QYlpOLzhsRDFlRHk4NXVZTDZwNTVmanBoY0M5SS9iUUVZaDlOeTdvUGY3b0taV213Wi9sKzlxTlkwSHN3LzJOMGdhN0JVekRyemtHVnhtYisyMm4yRkJNTm1xSm1Td0NvN0R6U0FtaHlWR25xQkJJNW5jV3dDUzJKTWF2TlhjMHZOb0NkY3NEVXBhbVRtWFlKVlRwZm0vVEwxTXBkaGhYSHF6eVpLMGFRbVM2SVBTdXgrb2pTc2QzakhHZHdtYVZ6VGtSVT0mT1R0LzZJdFRNSCs3NXZBa2F5NnF0MFF5Vm1jPQ==; _b="AZa5RrUzNI5BKJp73boVV6nO/gsMbDoWb4nxIKxkjEqgV8U5SuO4/pt8G1Jp5Tf+ZDQ="; csrftoken=53eb852a2f27acba9576e70fb0dbe5a4; _routing_id="beb999a4-dada-41d3-b9e4-f848ea55d68b";`,
    csrfToken: "53eb852a2f27acba9576e70fb0dbe5a4"
  },
  {
    name: "abhinav rao",
    tagPrefix: "b",
    sticker: "pinsticker_b",
    cookieStr: `_auth=1; _pinterest_sess=TWc9PSZYU3ZocndwQnA2cmNvdVBldkNDWHNvRE9Pa1Rrd1UrM3E5VllZeEd4NkxDZ1lhNlMzL2R1Ty9PdEZqdWQvYVNnLzBpMWF1NzZHYWY4KzFiOEhycndmZEE0MG5kRUtiWElqTDd2UnRmN0xDcXc0NUlkZ2FTMDhIYnF6R3ZvR21VbEJBK2NKcjlTZk1vcGFPMklwcnFuTjZWOUx0Q0ZrcWI1QnNYai9SUHg3SUlkTGVSUmFjSDdZMmZEZERIRWpZckNwSW9HUjF3WkoyTjhsUWxQNnZadFBvcjB0K1NIOVFoeWxlMkFubUdkU0JQRTZBcDFoYWt5L1Q1MHhpSi81N1hrNThlaWg4UklXT2JUWTRWOVhYR2dIZTVBUzhrZkNkOVpuK3BaOUR5bVppQkZOQm1jTko5NlNpdU5HbmE4eGhuRXk5N2pOczdROVljNEp2anFSU2NWVThUOTc3LzNqRjR4czd0azRKK2NXWndGZlF2amk2WE4xUDdoVzVockVGOG44RnBPY2dRamdsYno2RHJ1TStwVXBIMThvd29CYTBoT2ZLcS9EaCtyeVcyQ3dLYVc3MFlqNC92WGR1czRsa0VwQ3diVlFtbUdkazRsNHVPNWp4SXl0aDZ5RXF5K01tVEh0ZU1jZ2dRRHBKdW1KeTJLVHNSaWlrY0dPMERDa0NVMmpUUVhSMk1xLy8yNkZKQi9iOGtBdkpYdEp5T1FBU2l3U0ozL0g3eGhuQVY4Vm1ka2FwdXJQUmx3OHB2cm1UYmFQOXBsMFBHRVRmRGRjSElQMnl6YXY1MTlMR3ZCZGdXY1VjVTNyZldzeEZVS2JIMHBpOFllTSt6bGJkcWsvRU03TXoyMjl3RVA3RTFiR3pLL3lGVjlJejJlT3ppM1Mwbk95TjJveEhYTHFqU1NEQWFlTkNIQVAwb1l2Q1dXU0RqSDRSQjBSdDZvY0tmbHZ0UmVDU2JoZHplY1Z0K0ZkSUIyNWp3MEJ2bmx3c0JpeDdjNkJ3R0FqNGw3S0tVQitFZ0E2VlVkcnZLOWFBZmUrUkZFcUlXSnVKbUU0Mkxid0NlT28wL2hjWGZBWU1jMUpZQkxsYTUvU0Z3dVh6RkN5VEtSZUM5SDIrQkViTkczdWtHRjdxSHNHVTJ2WXJJaTlFOFlDY2pYeFdvTzJHVmU4VXNFdjM3b0ZGNmtKYnpzNzNpeGZWeEI3QXBiQTFVR2s5aTFPcTdrM1dXb1FEajMvV3hrRmMycUZkN09rbk9Sb0VKMWlIY2tKdHpDY3VKWUVEVjYyS1lVYnVpWmNMUTFnVnBnSmlScVZ6dXJ1WTZWMk5TUnc3M05IWEhlUmJlU0I1Zys3Vm0zOWI5Y1ZaQlNmL2ViaFNzeHpITGx4eXN1Z25BOGFVUkJvU1hReGdaNitYK0poY1Bma1lPNHU5MUtqQ1J1R05qUlhkRzRBNFpOSWpRSkFPLzdaQ1AvY2l5SXAwS3B4S3U1VG9aOEVMSnpoa09vd0h0aUgvSzdvdUk4QTEvNjV4YUxxaXpUUllsSnBDR1c1VExDZzNySGRxdlluQXNwL1Q0elNTMTY2SmJMU1hSa0VEc0ljN3BXUGFjMFdTRWVpVzRHUU1oRW1Rb2xZOFVsTGhscmJybmZKaXNwaFpLN1VOM01MOWZKQWF6N0E0UDk1QmREcVcwckJScUVRdzU2UzlLVTk4NVV2YWt4NG9Da080WlF3ODdpSmdhNk10S1dlcmxMOFM0VlRHbm9zRU4xQkdLY2VTcWl5ZjIxU3ZubUJxQ2hzT0tDeTNscHlVVTcmSjBPRSs0bWczUVFyMmpIRzZaamNZUkUyQlJrPQ==; l_o=YHs/Fro75TCThFYoodbZ1ld+QTN41IDanFTLBsXYUBsUjLtGuZ1kX51NE1TiNkhhrcXw0Y1q8sJd6u6DxygmcnV5XhbGEIIkQ0SH5hW36irJq+TEXd+9dFFOQNI7TGarQ9sZkEo=; __Secure-s_a=L093YWZpNGNDOXAxWXRpR0g2djExbndNM2doRTZWV29hWmlvMHI0U084Rml3ZFZUampYNTlab2tQTmVlOHlLeC8wSjArSHRnaGMxMzY0b0FJYWwralZjZjFtYlhaMi9renloemZ3L0hIZjdLK29GZzFrY3NyWFRSSlZTd0cwNlcwdlYxQjVyV2QwVGVOZExKRGZ6M240aHNMY1VPSnlPMkZDUXpBTnlTRDNDMUw3REp0alJLUk8wRzRjb2NHcC9tYmdwSDJiM1RTYU4ydFpFNEd4VFN2RkljMHJIdTYrbXJDN3kvNmxFVlNPdktBMHVib29xZkhrRWhtUTV0NUhNQ0lHWkFJOTQrMXdydnY3WWpUYXp0a1ZrZmY3eDlsRjQ4MU9OK2N2eE1SRU5pYnFBT2NzcUVWK1oybGRzWnBrdVJWb0Y3Z25iL1NSaUF6UFVSUzlySjA0dFVGOHRnR3p0Z1huR0RvZHBZR1lQa1U5dnJiNDdnbTBQR1pnbUhUcXNJL01ESWZQUis4blo5YkVGcmN2dFNqWXhSMDdwM1lPUVBUQ2FkL1orTWhkQ1VKL0FMS2dGVklGeVNkUTJJWUE1SWlQa0JHUzlnNUJIRDg4ekN0cGFrTzVZaFlETG13TW4rQWFRSy90dzlLNGlUaHk3UVVpWi80UmpzWWhXTHpaU3FPVlJrWEh3TkFCVmEwd1NLV1I2Y1dZWDRmZjdId0Uyc1hNZnFKTHQxVjY3R3VvNWhwUDRDcDNubTg5bVNrcGU4SGRSc3FYWm1BK2ovcG9BNlhZWGlIQUhpcDdZSld2Qk5wdzBJK01wNndyd25qRDNUaG9qVC8waVNDQklaamxXT2lteFp0clUrdHQyVEFDSzRJVEkzVkdSWm5sQWZhVEZUTG0wazR3dHlPMWNQbWZuZjJIaDkrUktzWVhTZ0JweUQ2N1A3TVczeVBlSDNVRy9Ka2dKdkZINmsvdGdkQUdaendhWUozMVJvSVRHV3Uzb21PMTJ5RHpMMVZ2SUJ4djIxZEd2WnFEc3ZuTlJjcXRFcit6WThXVkV0MU1SSXExS2RhYnZSZ1FWVjlUbUlCYWNLdXdIM0RyWGVqbjcrN0JZbExZSHdBWU5BYks5ZzNiR1hkd3c2S0E0SWE4aXBTS29KTjZXWit3S0dLVE1uWGdCRzdsenZBeWxjbk5yckp2UFdDUHdKNER6SlZiZE4vdUJSOVRjRVpVcWhOZXl2bklNWVhTYVVhUTlMeE01QzhBNFZWNTkxSGtiZU9WOTRXUGI0Zk5IRXdjQW1oR3pNdms0UGJ4bXlabGpUZDhra0h5QnlqdGs5VmdtRWFzaz0mVzZUOE1uTy9yVGE3bXZVd1lmRzFiSWZjTWRjPQ==; _b="AZXT0OF0ZCpDCoGaFDLIDOnxuF03SODfSqodwzx3CPTk77KqIjmP5dPQvI0b2OGXbig="; csrftoken=32604e7060850646f4d69f9cd0d7b9ce; _routing_id="8f4a204c-7a0a-4e05-b458-38814ce3811c";`,
    csrfToken: "32604e7060850646f4d69f9cd0d7b9ce"
  }
];

function buildCloudinaryUrl(publicId, stickerName) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/l_${stickerName},w_${BANNER_WIDTH},g_${BANNER_GRAVITY},x_${BANNER_MARGIN_X},y_${BANNER_MARGIN_Y}/${publicId}.mp4`;
}

function extractPublicId(url) {
  const match = url.match(/\/([^\/\?]+)\.mp4/);
  return match ? match[1] : null;
}

function timeSince(start) {
  return `${((Date.now() - start) / 1000).toFixed(2)}s`;
}

function getHeaders(acc) {
  return {
    "accept": "application/json, text/javascript, */*, q=0.01",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/x-www-form-urlencoded",
    "cookie": acc.cookieStr,
    "origin": BASE_HOST,
    "referer": `${BASE_HOST}/pin-creation-tool/`,
    "sec-ch-ua": '"Chromium";v="152", "Not?A_Brand";v="24", "Google Chrome";v="152"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36",
    "x-app-version": "6550262",
    "x-csrftoken": acc.csrfToken,
    "x-pinterest-appstate": "active",
    "x-pinterest-source-url": "/pin-creation-tool/",
    "x-requested-with": "XMLHttpRequest"
  };
}

async function downloadFile(url, destPath) {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 30000,
    maxRedirects: 5,
    headers: { "User-Agent": "Mozilla/5.0" },
    validateStatus: () => true
  });
  if (response.status !== 200) {
    throw new Error(`Download HTTP Error: ${response.status}`);
  }
  fs.writeFileSync(destPath, Buffer.from(response.data));
}

async function fetchUserBoards(headers) {
  const payload = new URLSearchParams({
    source_url: "/pin-creation-tool/",
    data: JSON.stringify({ options: { filter: "all", sort: "alphabetical" }, context: {} })
  });
  const res = await axios.post(`${BASE_HOST}/resource/BoardPickerBoardsResource/get/`, payload.toString(), { headers, timeout: 10000, validateStatus: () => true });
  const boards = res.data?.resource_response?.data?.all_boards;
  if (Array.isArray(boards) && boards.length > 0) return boards.map(b => ({ id: b.id, name: b.name }));

  const fallback = new URLSearchParams({ source_url: "/pin-creation-tool/", data: JSON.stringify({ options: {}, context: {} }) });
  const res2 = await axios.post(`${BASE_HOST}/resource/BoardsResource/get/`, fallback.toString(), { headers, timeout: 10000, validateStatus: () => true });
  const boards2 = res2.data?.resource_response?.data;
  if (Array.isArray(boards2) && boards2.length > 0) return boards2.map(b => ({ id: b.id, name: b.name }));

  if (res.data?.resource_response?.error) {
    console.error("Pinterest API Error:", JSON.stringify(res.data.resource_response.error));
  }
  throw new Error("No boards found for account.");
}

async function registerMediaUpload(headers) {
  const clientUUID = crypto.randomUUID();
  const payload = new URLSearchParams({
    source_url: "/pin-creation-tool/",
    data: JSON.stringify({
      options: { url: "/v3/media/uploads/register/batch/", data: { media_info_list: JSON.stringify([{ id: clientUUID, media_type: "video-story-pin" }]) } },
      context: {}
    })
  });
  const res = await axios.post(`${BASE_HOST}/resource/ApiResource/create/`, payload.toString(), { headers, timeout: 15000, validateStatus: () => true });
  const dataMap = res.data?.resource_response?.data;
  if (!dataMap || !dataMap[clientUUID]) throw new Error("Failed to register media upload ID.");
  return dataMap[clientUUID];
}

async function uploadVideoToS3(uploadData, filePath) {
  const form = new FormData();
  for (const [key, value] of Object.entries(uploadData.upload_parameters)) {
    form.append(key, value);
  }
  const fileData = fs.readFileSync(filePath);
  form.append("file", fileData, { filename: "video.mp4", contentType: "video/mp4", knownLength: fileData.length });

  const s3Res = await axios.post(uploadData.upload_url, form, {
    headers: { ...form.getHeaders() },
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    timeout: 60000,
    validateStatus: () => true
  });
  if (s3Res.status >= 400) throw new Error(`S3 Upload failed: ${s3Res.status}`);
}

async function createPinWithCover(caption, link, uploadId, boardId, coverUrl, headers) {
  const payload = new URLSearchParams({
    source_url: "/pin-creation-tool/",
    data: JSON.stringify({
      options: {
        board_id: String(boardId),
        description: caption,
        link: link,
        title: caption.slice(0, 100).trim(),
        image_url: coverUrl,
        media_upload_id: String(uploadId),
        origin: "PIN_CREATION_TOOL"
      },
      context: {}
    })
  });
  const res = await axios.post(`${BASE_HOST}/resource/PinResource/create/`, payload.toString(), { headers, timeout: 25000, validateStatus: () => true });
  return res.data;
}

(async () => {
  const totalScriptStart = Date.now();
  try {
    console.log("📊 Reading latest target reel from Google Sheet...");
    const sheetRaw = await (await fetch(SHEET_CSV_URL)).text();
    const lines = sheetRaw.trim().split("\n");

    let chosenRow = null;
    for (let i = lines.length - 1; i >= 1; i--) {
      const match = lines[i].match(/(".*?"|[^",\r\n]+)(?=\s*,|\s*$)/g);
      if (!match) continue;
      const clean = match.map(v => v.replace(/^"|"$/g, "").trim());
      const url = clean[0] || "";
      const caption = clean[1] || "";
      const link = clean[2] || "";

      if (url.startsWith("http")) {
        chosenRow = { url, caption, link, index: i };
        break;
      }
    }

    if (!chosenRow) throw new Error("No valid row found in sheet.");

    const cloudVideoId = extractPublicId(chosenRow.url);
    if (!cloudVideoId) throw new Error("Could not parse Cloudinary Public ID.");

    console.log(`🎯 Target Video Public ID: ${cloudVideoId}`);
    console.log(`📋 Base Caption: ${chosenRow.caption}`);

    // Sequential loop across pool with isolated error handling
    for (const acc of PINTEREST_ACCOUNTS_POOL) {
      const tempFile = `video_${acc.tagPrefix}.mp4`;
      try {
        console.log(`\n============================================`);
        console.log(`🚀 Processing Pinterest: [${acc.name}] (Prefix: ${acc.tagPrefix})`);
        console.log(`============================================`);

        const headers = getHeaders(acc);
        const boards = await fetchUserBoards(headers);
        console.log(`📋 Found ${boards.length} boards on ${acc.name}.`);

        const targetVideoUrl = buildCloudinaryUrl(cloudVideoId, acc.sticker);
        const targetCaption = `${acc.tagPrefix}${chosenRow.caption}`;

        console.log(`📥 Downloading stream with sticker [${acc.sticker}]...`);
        await downloadFile(targetVideoUrl, tempFile);

        console.log(`📡 Step 1: Registering media...`);
        const uploadData = await registerMediaUpload(headers);

        console.log(`☁️ Step 2: Uploading S3 buffer...`);
        await uploadVideoToS3(uploadData, tempFile);

        console.log(`⏳ Waiting 300s transcode buffer...`);
        await new Promise(r => setTimeout(r, 300000));

        const coverUrl = targetVideoUrl.replace(/\.mp4(\?.*)?$/i, ".jpg");

        console.log(`🚀 Step 3: Publishing Pin...`);
        let published = false;
        for (const board of boards) {
          const pinRes = await createPinWithCover(targetCaption, chosenRow.link, uploadData.upload_id, board.id, coverUrl, headers);
          if (pinRes?.resource_response?.data?.id) {
            console.log(`🎉 SUCCESS! Pin Published on [${acc.name}] | Board: ${board.name} | Pin ID: ${pinRes.resource_response.data.id}`);
            published = true;
            break;
          }
        }

        if (!published) {
          console.error(`⚠️ Could not publish pin on any board for ${acc.name}`);
        }
      } catch (accErr) {
        console.error(`❌ [Account Error - ${acc.name} Skipped]: ${accErr.message}`);
      } finally {
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }
      }
    }

    console.log(`\n🏁 Multi-account cycle finished in ${timeSince(totalScriptStart)}`);
    process.exit(0);
  } catch (err) {
    console.error(`\n❌ [Fatal Error]: ${err.message}`);
    process.exit(1);
  }
})();
