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
// 🏊‍♂️ PINTEREST ACCOUNTS POOL (Yahan naye accounts add karo)
// =====================================================================
const PINTEREST_ACCOUNTS_POOL = [
{
    name: "ania sharma",
    tagPrefix: "a",
    sticker: "pinsticker_a",
    cookieStr: `_auth=1; _pinterest_sess=TWc9PSYyRnRtWlk4ZUNMNTRyV0ZpbGZTSDdySko2L09YRkMvNXVpdVhXR1pqNUZWR2RaVWdyNGlPK1BMdGhhOWo1ZDNJaGJmRjNXZTk2UU12cHQxVExMTHdlTWhadkp0Z1pnVmgwMEV2ajVIOWFqNEJpUjhHWmtOcW1YT1NRa1J5NkdyaXA4WnZxR3dMSy9NSW9zcWI3UWtlL3Q5UHN5cWlMekl6RzFqUUxHanZlRTNobXJ1NGtxT1RWcTRhQW5MYjBDbTN0Y29qSTg1R1h4ZmY1MXBHQ0t2MEJtNVIxL2dyNG94enNyYm1uODVCb3RxTi93KzFzbTB5RWpDdDVvamdsY1owcjFHNUNJc0xPbFBaOWR3REJlNzl3UkxuWWVNaFRZbTdySW1IYjNTTlNCVFd0ZHBVM3lPSklZYVA3VlU1bWdVTXQwSUxONjNJZXJoT2E5VDE0ZENla3lmUXhqNWRWUUpNZiszN3VpR28wZWhCaTR1RUpRN2E3WFoxb0ZmenAzOGQ1eWo1Yi9sd2Ewamp0SGVpbGh2S2wydEV2ZjllYS9jR1RGMU1rbVpEclR6ajk1ekYyaXJsdXlVbnJ5YjJZUWdpbDJuZjJKZHZRa3VsMENhNm1iUkZvVWs4ZUMyb2V0azhFYi9DVUQrbG1WZ29qQlE2SjNwKzFkbCt6Z0FtaHlmMDNaOEtDZnZDTll4WEhJTHRYWWYzSnk2QUFoKzJiSlN3bXZRb2F6Tk1UMFl1SVVzZ0FKTWFNd0NjYTlQM1ZSb0g1SGZQbTgvV3ZGNnZrTm1ud0ZUUzVGaVA3SEYrUVVYb2ExUFJ1ZDZTVjBvdFU5dVpYMWVtSVNmS3JCakhKMU9WRlBibEVDL3pVeEhTKzMzSWliMStQSytHb04ybGRkRHgvSHpXelBOMnB3NDVESGwyYVkwd3VNeENCZm0za2RuNnR6S3hKNHg3NG9pOGdmZ2UyVXh3aDNoTS9QWmhLVW1RVmtjU1pYcVh0bmVjbWt3QUJRVTA4ai95YjlxcnorOGZOUnJSR2RSOWNJZS9DZ1RWUGtMT2Q5SFh4Tk42eFlza0lWM284bDdxZUo1NGdjNkkyWTY3dGgvZnl0cElWZnErMm05SE9LNWdTMUpleHB1SWVZeTc3MU14QkFzOWE0dFZrOGNja2o3U2IwZG4wd2ZhR2ZuOWtXNWZNK1kwMXRObTR3TVV3eGtTSSttbm9VTDloUEFyVk9Tdkg1UmtKOHhFMmhyNWhOYnV1a3liYVkrQm4yYmhGamNyd0ZrTkFlNVBlRFpDeTdCVkNlRHFVZ1plelV0eldrRmVqZWZkMmZxOHpja2JLZnRkQk94NXV6bWRBRi9tZ3BZMEhoZlFqL2E5bVdKL2ZVN05hQ1M5TFpRNUNiZWJhRzJIaGRyU2xLMUNTQ1RJMG5KNDFJQ21CL2tYM2pzK0NrcHloZGZKaitqcERvRHZQSU1scXM2RlpORXNJNXlpUXQrbDNGcXVmY3AxcC9JbklaSFV6RHR4d1ZjZ3c1RndrczlycFB4VVRqdGhUZVpkbTdQQ0pMajArcFZFMWhFdUtIV211V0JyVG9OOE8rdUN3TE5iV1gyTE5SK014OEltNnVuaWRQcXNrQktTc1BESmRXakxGMGUxbTlNWWZyQzhhTmVNbC9EYzNUU0FPVDdKMEs1dlZNUDQ3MkpaTHhkSllqRTNOYkoxN1U1cjZ2NDNpb2VIZkJBZFcxbVNhV0dPV2tsTUFvTTc2Y04wSTBaUDdSUHczU1d3dVZwM2pRdGpncnZFSDZFWmhGemkmWm8va3pNcm5xVFp0aXVCekFIY2k2djN3QXJJPQ==; l_o=kiEa7Mb9mVgg/N06ODd0M6HDatZtOVDzyW1MTcZp26mUe6qd2N87tD712lJ9Ih7M6wKKiAc1djWnLvfZ1wOSLZPysu/zUmwIob6R/mHLd9ntnr+Gkxv7+6LqVhB7V6uAweOG; __Secure-s_a=UnhvVVlHTy9zaEhjTnR3eENxTkJYTEdhZktaZEFmWE1ZRFMwUWhtd1JDNFhjK1hUdGtjNzNpaXFaek1udklZYjkwVklIaG1XaEc1ZkJCSmpZM0pxSzg5bTVWRkZTM1FubW9HT1lSVlVndWdMdk1FWjRGZkpnSi9QWVZSNHZMUnpUR3FEdDhBU1FGZGdOZXZvQWg4WGJCSkZTV3RrZ3plT1lmZFVQUzRrVUhkSkdUdVZtalB2OGVDK1k3YkxYc0xWNTIxQXBvdExycWVpWENEM0xlWkJWdEJaTHo4Zm95YzFRRXhhUlRyNnZVYUI2TXphQy9JeUYyQkFTbXpHTkhySitHd242N0RraGFCNEw1RGVheUFHSE41bkxKcTN1V2l0dlI2UlAvNEs3VlQxTkFuRzcwbWJZY2RJNGtaUUNCWUxaaWxiK0ZPbVppZWYydkZNUFYzakhCclp2NnBwYjhrNWtFZUFTVnM3eWt4N2hrY2V0NjUzZU05UHg5WEp2cGlKYVdlaXFRTFB4YlkvcW9mNjRkNTdqSkdiRE9NdEloc3VHeTNnREkxRUY3MjR3SUN5bjVXN0ZSRlJkRzFEUjdLSCthZTFYRUg4SVNVOXlXbVMyNWo3RVhPQ1VrN1pVZC92RjVEKzFMVHo2UUNaNHhreEtsRUd3ek5JdFNidmFIZ1VIcU1KbW1lWW9id2dIUUUrcFhDY2FMTFVvQWlaNWhJWDFRbFhFNlRzRnNWR0xzbGovVDZaWWdBZ3NYOUhSZHRGVjdaRjJqeTZRL0dURlVKYlpxVVFEWndkaXhrWWJOam9BOVVucXR2RVo3Yy9lVG8zdTloTXZ6ZlR5VzMxeTM4RE5rcXNaQmI4ZW5Bd1hoOWZ5Q2wyYmwwMXY3TnZMRzArWHpzSWFmMkJTOXphOTdzeE0yemF6VGp2c2hxRVpNbkszalFZUURGMGQzK2t0NS9EWFM3ejdBeWF2a3g3YnF6dHZyS3BmWDlYL29yWGFaZC9MR2ZnWE5oM1J5bFVzZVZtV1FMWlorUWdwbzRwQzBEMk5CMi82TlN0M0hhQy9VMVhmYXJnRS9QYlpOLzhsRDFlRHk4NXVZTDZwNTVmanBoY0M5SS9iUUVZaDlOeTdvUGY3b0taV213Wi9sKzlxTlkwSHN3LzJOMGdhN0JVekRyemtHVnhtYisyMm4yRkJNTm1xSm1Td0NvN0R6U0FtaHlWR25xQkJJNW5jV3dDUzJKTWF2TlhjMHZOb0NkY3NEVXBhbVRtWFlKVlRwZm0vVEwxTXBkaGhYSHF6eVpLMGFRbVM2SVBTdXgrb2pTc2QzakhHZHdtYVZ6VGtSVT0mT1R0LzZJdFRNSCs3NXZBa2F5NnF0MFF5Vm1jPQ==; _b="AZa5RrUzNI5BKJp73boVV6nO/gsMbDoWb4nxIKxkjEqgV8U5SuO4/pt8G1Jp5Tf+ZDQ="; csrftoken=53eb852a2f27acba9576e70fb0dbe5a4; _routing_id="beb999a4-dada-41d3-b9e4-f848ea55d68b";`,
    csrfToken: "53eb852a2f27acba9576e70fb0dbe5a4"
  }
  /*
  // Account B:
  ,{
    name: "Account B",
    tagPrefix: "B",
    sticker: "pinsticker_b",
    cookieStr: "COOKIE_B_HERE",
    csrfToken: "CSRF_B_HERE"
  }
  */
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
    "origin": "https://in.pinterest.com",
    "referer": "https://in.pinterest.com/pin-creation-tool/",
    "sec-ch-ua": '"Chromium";v="152", "Not?A_Brand";v="24", "Google Chrome";v="152"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36",
    "x-app-version": "a73904a",
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

  throw new Error("No boards found.");
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

    // Sequential loop across pool
    for (const acc of PINTEREST_ACCOUNTS_POOL) {
      console.log(`\n============================================`);
      console.log(`🚀 Processing Pinterest: [${acc.name}] (Prefix: ${acc.tagPrefix})`);
      console.log(`============================================`);

      const headers = getHeaders(acc);
      const boards = await fetchUserBoards(headers);
      console.log(`📋 Found ${boards.length} boards on ${acc.name}.`);

      // Dynamic URL & Caption
      const targetVideoUrl = buildCloudinaryUrl(cloudVideoId, acc.sticker);
      const targetCaption = `${acc.tagPrefix}${chosenRow.caption}`;
      const tempFile = `video_${acc.tagPrefix}.mp4`;

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

      if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      if (!published) console.error(`⚠️ Could not publish pin on any board for ${acc.name}`);
    }

    console.log(`\n🏁 All Pinterest accounts processed in ${timeSince(totalScriptStart)}`);
    process.exit(0);
  } catch (err) {
    console.error(`\n❌ [Fatal Error]: ${err.message}`);
    process.exit(1);
  }
})();
