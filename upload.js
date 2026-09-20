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
    name: "Account A",
    tagPrefix: "a",
    sticker: "pinsticker_a",
    cookieStr: `_auth=1; _b="AZgSUQe+7LpKbIXa/dQXc7sGhh6wB8ovf4jrcfCWyHdXobCpbpN1N2o2I8nKRYvuO0g="; _pinterest_sess=TWc9PSZHY2pvcHdyd3ZyaHhnMVRhUFRtRzlxUUNQWW1RdjhleXg4U1lTY2hEN3ZVMWt6ZlBnNDJGMWhIZmhvR2E5VkR4YnhZT0ptREl5Zk9JcFlyTEpNdllyWUtiUWZ0V1ZaK2dvWjllL21qUmwrS0dxdWpUUzlJM0QzaXFVWXg0clIwTCs3bjloUVVDN0t5N0s2aG44Q2FXR2EvMXppYnJHRndWaFd1YnI3L2gxQUE2eVR1bnFQT1BZKzdCYVp0bi91TnhmaVVmSzRiektleGNLd2FzdVRNKzkxazNuZzNVaUwxODlZOHlvUmduSCsyREVYUUhrcWNCdUZEb3B1NUJRQ2hiUkIweVJMK0J6WUh6YXYvWXlqVDNaM01oRjhxd0dmT3dPZ3ByWEZieG5ESWdiaFoyWUlLMWJ4aGxIRTdMRnpVR2lpWlM2SE5KSXlmQ2RzOTNHOXhXYmkyN21LUERMMVhpNDR6R2h1TzllVTY3OUxDdDQrcGYzS0JjMnJZNDZxNkZMT0xOS3p1YzRCa3RrWU5tNlVXaWl1cmk5cWM0ZGpQdW5wRTVPMWRGaFdQZEZsdVprdFRrRGdHdEdDNXV6WTFjcW9RbnVxR295MC90ZXRQc0pQRzB6cENwKzJYcUZhV1NTSVNzcVRUWStqUk84ZHo1TC9YWU9mV1dHZTRGWndLQldBMzdybHBxYytLL01JTEVKT1gvdCtWSjJnSGorUWJtUk02YW9IbDU4eWltek5jbTlEOWxtRDBYTjZ0WGV4alZQam9XY2FaR2NCQ1BiMXBrUGhick5aSys4bU11eGhLWFE3TDhyUHNQK2VtNDFMWFdXVzdpZTVoRk8zSkdhdG1EdFJodWcwTythbisrdHFQUTRNR2NSWG1uQXlOTjFVeWM0bXBZVTFvUU95eDVxTnJlMGZrcTZTNG8wVkNSd2ozSjQ5WXFjZWhqY1NRcThyT3VxVkhHTFN1YWNVTmEycGRUMUR5Z1MxWC82YUxHanVDdktFdjc0ZFF0UTdFT3pQUE9zNUpvUzVTZmNISmNRRFcrWEdyenVRNXpzbDQ4U0w2UVlhVXRoNmpUUWRpM05IWnNKd0ZxWjJDNlhPalVyYnd5VkhpZGVJc3NENnRObWV3VE5DdGRSR2pkSXFDZXpjZmlzYTNLTGE0TFBuMjc2MGxXelVOVmVHc0kzeW83MCtKRjJ0ME5xMjZmY29nUzRna21lYTl1V0R4WVNDaGRvT2F5cFpyaUcwVEh4Qk1qU2d3Z1VGYkN6M0VlOEdicjhuVGdDT3hSSnJISW10NkNtS1FYclJoWXY3dHlobnBDWTNHRGFVRENSQWFiMzhOV0t2bzF2bDdBeG9JSG1ENlhkeEJpN2Jhd0t3UnF6dkl2RjZXRDlTVDdDMmY5dnFEVTRQVDhLaUh2SWNuWXZJS01UU09UYkhrWExOVVFNeUM3U2wwMkpHb0wvYzNmdGF6RVNCR0w5a3BycDEzVGRVQVhvNmI1SkFMdjZrdWJmek5YV1k5dGVtaVVEeTVHZEE0YzBuRkRjcms1Mi8vY0o5Rm80QUtpZlo3dXVsVzVRMXI3czFpL3QzdVpTczU1Zkh4OTFGNEZuY2VLanAyQklwM2F6c2dSbm5UeVkwNzhTcUo0RGwxbWdNQlEvTmpFZDJxOTBheG9UUml0M0hObE14WXhIcWw1d0xScU5xaHUxckZBTVZPQ3ZTTm5uK0FoVzdTRHpNODdVUmh2VUxWV2N4aWpxV0tOdm1BMkpoN0I3cWlMTWpmZllyR00rOFd6V0FkMDFmdG0mYmNodUl6RGYxdUEwcTY3RWJTS2hGa2EzMWE4PQ==; l_o=BSQlKQAydAOCD9OrozqDrQGKK+2rb4Py/rWdoXMBsxC+e6qvNalVztQdIanWmDJDslYH5T3Vg6gqhXuT1WQjWKAEwvfc/xsVrFnJDYStHqFJ0/QwbAA3UPpSgeOH6lMEXVuH; __Secure-s_a=SHNEMi9BNDY0dFVxVGJjT1JXbFM4bUhzTGRXem9tdStFQTFxZzUvODRCL1hFd3hneVhIdm1IVkx1bnZsUG4rbEZPR3FkZTRYTXBCWlhNMFYwSEYyRGRKTXBpeW05U2Y1ZC9Cc2ZWeHJ2OTAzOUVoWHE5bEREM3hFeE45SXl6OUs3UW9TdGIvT09iR1J4alNXSnRHZnZPV0ZYbWozZDlLenBnZWNMK2M0WlovSnUweldDd0UvZnhnN3ZvVndDMmFRMUFuZE9HK1VHQnQ1L0tmZlN4MGI5RDhKdVljQnNHeS9jMWJNV1JTcHpqRElEMVBXNHBvVnc4KzFQb0xpUzNQbHhGT3JqVHpsZzgvR0ZFQjljQSt1MktRa1FzNnNPWEoyVlJYdU5lekNwOVVGN1Vpb2U3V0JMQmRSWTVvQmd0K2FrQkJzRTc0eTFiRm8zTUtRdzFtdk85M1RvS05lTFlRYW5CK2IzeHJEUUJMSkJLbXVyRllEZXc3QitvRFdIVzRXZFg5VHV4Y1pHTjVhb2p6UWRXVjAvZ05WS3V6dVhXd29mcENEZ1JyQTQrVXVwUmNKN3hTSDVqQ3lOS1U3NkxiUUZHcE5pdyttb0wyeFVqdFpNV09STEszMjB4R2c2WXZjb29EaTZ2dXVMWlVubldiZTJJeXI3bENEcFAxdnM3REVSS1BlL0hkbG00T29ZaGR5UWpQblg2bG94dWtxR0h2M09kcFp6U29zNTlLc3M4S2I5T0dOUUNXQUJvYVd3d3V5S1pGenN3SHM1S3hZNEpmS1lDZDFXL0ZCcmp5WmhNUUpwcEx5VGZPd0JYUGZ1M0JUV1d5VlZvOUR5ZzdGaHZjZE9Zb0FZN1l5cEV0dW1Wdit1dm5xcWVRVFhuQnVaOU1EUExzTmpxOVBxU3BZZ0xYSGVUeGx1czhhQmxXdCsrd3h2WHg2THJHeHdmZVo0cEJ4RzFJdWJ1S2xSZDFTOGloMktDNjJUdjQwK1lkczJZaFlCNUxTdVNnME1UVForc0wwNkJ1NHRSVVIvck9PWmN2ZnkzblpjbzNISUVyZThsV1hpU1Yya0crYWlvSjN3K3lJcDNvcXZCcERDQnNWYUkxT3F3aDlWbWpTTFM1NjgyZlovUkM3ZndxWE9kSStRUWgxbGZuQmlpSWJ1N3JJT2ZqdERud3RRRHlmUFJTREJFdFh4cnI3YTBWdmF6R0xrNkRvNGVWZFJhdEY2OGdTOWkzaFF2UTdxOUlxaHNoMytyT1ErQTNoTnk3STlZNjQyMVI5aW9zUVYvMFYxUTVGV3pPb2RaOHFvb1JTQmZRRjd0L1pySkVBeGhaMkJpdz0mODRwaDFZbGEraUt2SENXVDFWQU8yTTc1RklBPQ==; csrftoken=f18608109998b101d4a149e7a7024d32; _routing_id="9eb3a425-4e49-4d31-b92e-44d5dd29a014"; sessionFunnelEventLogged=1; g_state={"i_l":0,"i_ll":1789433316400,"i_b":"AZijqg7FK0lO/QHQFYrlshPXPD/MI150d27Bo1Q6MIQ","i_e":{"enable_itp_optimization":24},"i_et":1789433316400}`,
    csrfToken: "f18608109998b101d4a149e7a7024d32"
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
