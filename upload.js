const fs = require("fs");
const crypto = require("crypto");
const axios = require("axios");
const FormData = require("form-data");
const { execSync } = require("child_process");
const path = require("path");

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1MrwItyy6IPNLSJbz1b53TGOTS2JBLTyg46Ql9xZpI6w/gviz/tq?tqx=out:csv&sheet=PinterestQueue";

const BASE_HOST = "https://in.pinterest.com";

// =====================================================================
// ☁️ CLOUDINARY CONFIG
// =====================================================================
const CLOUD_NAME = "djlipqlut";
const BANNER_WIDTH = 380;
const BANNER_MARGIN_X = 10;
const BANNER_MARGIN_Y = 40;

// Random Stickers Pool (inme se koi bhi randomly pick hoga)
const AVAILABLE_STICKERS = ["pinsticker", "pinsticker_a", "pinsticker_b"];

// =====================================================================
// 🏊‍♂️ PINTEREST ACCOUNTS POOL
// =====================================================================
const PINTEREST_ACCOUNTS_POOL = [
  {
    name: "ania sharma",
    tagPrefix: "a",
    cookieStr: `_auth=1; _pinterest_sess=TWc9PSYyRnRtWlk4ZUNMNTRyV0ZpbGZTSDdySko2L09YRkMvNXVpdVhXR1pqNUZWR2RaVWdyNGlPK1BMdGhhOWo1ZDNJaGJmRjNXZTk2UU12cHQxVExMTHdlTWhadkp0Z1pnVmgwMEV2ajVIOWFqNEJpUjhHWmtOcW1YT1NRa1J5NkdyaXA4WnZxR3dMSy9NSW9zcWI3UWtlL3Q5UHN5cWlMekl6RzFqUUxHanZlRTNobXJ1NGtxT1RWcTRhQW5MYjBDbTN0Y29qSTg1R1h4ZmY1MXBHQ0t2MEJtNVIxL2dyNG94enNyYm1uODVCb3RxTi93KzFzbTB5RWpDdDVvamdsY1owcjFHNUNJc0xPbFBaOWR3REJlNzl3UkxuWWVNaFRZbTdySW1IYjNTTlNCVFd0ZHBVM3lPSklZYVA3VlU1bWdVTXQwSUxONjNJZXJoT2E5VDE0ZENla3lmUXhqNWRWUUpNZiszN3VpR28wZWhCaTR1RUpRN2E3WFoxb0ZmenAzOGQ1eWo1Yi9sd2Ewamp0SGVpbGh2S2wydEV2ZjllYS9jR1RGMU1rbVpEclR6ajk1ekYyaXJsdXlVbnJ5YjJZUWdpbDJuZjJKZHZRa3VsMENhNm1iUkZvVWs4ZUMyb2V0azhFYi9DVUQrbG1WZ29qQlE2SjNwKzFkbCt6Z0FtaHlmMDNaOEtDZnZDTll4WEhJTHRYWWYzSnk2QUFoKzJiSlN3bXZRb2F6Tk1UMFl1SVVzZ0FKTWFNd0NjYTlQM1ZSb0g1SGZQbTgvV3ZGNnZrTm1ud0ZUUzVGaVA3SEYrUVVYb2ExUFJ1ZDZTVjBvdFU5dVpYMWVtSVNmS3JCakhKMU9WRlBibEVDL3pVeEhTKzMzSWliMStQSytHb04ybGRkRHgvSHpXelBOMnB3NDVESGwyYVkwd3VNeENCZm0za2RuNnR6S3hKNHg3NG9pOGdmZ2UyVXh3aDNoTS9QWmhLVW1RVmtjU1pYcVh0bmVjbWt3QUJRVTA4ai95YjlxcnorOGZOUnJSR2RSOWNJZS9DZ1RWUGtMT2Q5SFh4Tk42eFlza0lWM284bDdxZUo1NGdjNkkyWTY3dGgvZnl0cElWZnErMm05SE9LNWdTMUpleHB1SWVZeTc3MU14QkFzOWE0dFZrOGNja2o3U2IwZG4wd2ZhR2ZuOWtXNWZNK1kwMXRObTR3TVV3eGtTSSttbm9VTDloUEFyVk9Tdkg1UmtKOHhFMmhyNWhOYnV1a3liYVkrQm4yYmhGamNyd0ZrTkFlNVBlRFpDeTdCVkNlRHFVZ1plelV0eldrRmVqZWZkMmZxOHpja2JLZnRkQk94NXV6bWRBRi9tZ3BZMEhoZlFqL2E5bVdKL2ZVN05hQ1M5TFpRNUNiZWJhRzJIaGRyU2xLMUNTQ1RJMG5KNDFJQ21CL2tYM2pzK0NrcHloZGZKaitqcERvRHZQSU1scXM2RlpORXNJNXlpUXQrbDNGcXVmY3AxcC9JbklaSFV6RHR4d1ZjZ3c1RndrczlycFB4VVRqdGhUZVpkbTdQQ0pMajArcFZFMWhFdUtIV211V0JyVG9OOE8rdUN3TE5iV1gyTE5SK014OEltNnVuaWRQcXNrQktTc1BESmRXakxGMGUxbTlNWWZyQzhhTmVNbC9EYzNUU0FPVDdKMEs1dlZNUDQ3MkpaTHhkSllqRTNOYkoxN1U1cjZ2NDNpb2VIZkJBZFcxbVNhV0dPV2tsTUFvTTc2Y04wSTBaUDdSUHczU1d3dVZwM2pRdGpncnZFSDZFWmhGemkmWm8va3pNcm5xVFp0aXVCekFIY2k2djN3QXJJPQ==; l_o=kiEa7Mb9mVgg/N06ODd0M6HDatZtOVDzyW1MTcZp26mUe6qd2N87tD712lJ9Ih7M6wKKiAc1djWnLvfZ1wOSLZPysu/zUmwIob6R/mHLd9ntnr+Gkxv7+6LqVhB7V6uAweOG; __Secure-s_a=UnhvVVlHTy9zaEhjTnR3eENxTkJYTEdhZktaZEFmWE1ZRFMwUWhtd1JDNFhjK1hUdGtjNzNpaXFaek1udklZYjkwVklIaG1XaEc1ZkJCSmpZM0pxSzg5bTVWRkZTM1FubW9HT1lSVlVndWdMdk1FWjRGZkpnSi9QWVZSNHZMUnpUR3FEdDhBU1FGZGdOZXZvQWg4WGJCSkZTV3RrZ3plT1lmZFVQUzRrVUhkSkdUdVZtalB2OGVDK1k3YkxYc0xWNTIxQXBvdExycWVpWENEM0xlWkJWdEJaTHo4Zm95YzFRRXhhUlRyNnZVYUI2TXphQy9JeUYyQkFTbXpHTkhySitHd242N0RraGFCNEw1RGVheUFHSE41bkxKcTN1V2l0dlI2UlAvNEs3VlQxTkFuRzcwbWJZY2RJNGtaUUNCWUxaaWxiK0ZPbVppZWYydkZNUFYzakhCclp2NnBwYjhrNWtFZUFTVnM3eWt4N2hrY2V0NjUzZU05UHg5WEp2cGlKYVdlaXFRTFB4YlkvcW9mNjRkNTdqSkdiRE9NdEloc3VHeTNnREkxRUY3MjR3SUN5bjVXN0ZSRlJkRzFEUjdLSCthZTFYRUg4SVNVOXlXbVMyNWo3RVhPQ1VrN1pVZC92RjVEKzFMVHo2UUNaNHhreEtsRUd3ek5JdFNidmFIZ1VIcU1KbW1lWW9id2dIUUUrcFhDY2FMTFVvQWlaNWhJWDFRbFhFNlRzRnNWR0xzbGovVDZaWWdBZ3NYOUhSZHRGVjdaRjJqeTZRL0dURlVKYlpxVVFEWndkaXhrWWJOam9BOVVucXR2RVo3Yy9lVG8zdTloTXZ6ZlR5VzMxeTM4RE5rcXNaQmI4ZW5Bd1hoOWZ5Q2wyYmwwMXY3TnZMRzArWHpzSWFmMkJTOXphOTdzeE0yemF6VGp2c2hxRVpNbkszalFZUURGMGQzK2t0NS9EWFM3ejdBeWF2a3g3YnF6dHZyS3BmWDlYL29yWGFaZC9MR2ZnWE5oM1J5bFVzZVZtV1FMWlorUWdwbzRwQzBEMk5CMi82TlN0M0hhQy9VMVhmYXJnRS9QYlpOLzhsRDFlRHk4NXVZTDZwNTVmanBoY0M5SS9iUUVZaDlOeTdvUGY3b0taV213Wi9sKzlxTlkwSHN3LzJOMGdhN0JVekRyemtHVnhtYisyMm4yRkJNTm1xSm1Td0NvN0R6U0FtaHlWR25xQkJJNW5jV3dDUzJKTWF2TlhjMHZOb0NkY3NEVXBhbVRtWFlKVlRwZm0vVEwxTXBkaGhYSHF6eVpLMGFRbVM2SVBTdXgrb2pTc2QzakhHZHdtYVZ6VGtSVT0mT1R0LzZJdFRNSCs3NXZBa2F5NnF0MFF5Vm1jPQ==; _b="AZa5RrUzNI5BKJp73boVV6nO/gsMbDoWb4nxIKxkjEqgV8U5SuO4/pt8G1Jp5Tf+ZDQ="; csrftoken=53eb852a2f27acba9576e70fb0dbe5a4; _routing_id="beb999a4-dada-41d3-b9e4-f848ea55d68b";`,
    csrfToken: "53eb852a2f27acba9576e70fb0dbe5a4"
  },
 {
  name: "abhinav rao",
  tagPrefix: "b",
  cookieStr: `_auth=1; _pinterest_sess=TWc9PSZYU3ZocndwQnA2cmNvdVBldkNDWHNvRE9Pa1Rrd1UrM3E5VllZeEd4NkxDZ1lhNlMzL2R1Ty9PdEZqdWQvYVNnLzBpMWF1NzZHYWY4KzFiOEhycndmZEE0MG5kRUtiWElqTDd2UnRmN0xDcXc0NUlkZ2FTMDhIYnF6R3ZvR21VbEJBK2NKcjlTZk1vcGFPMklwcnFuTjZWOUx0Q0ZrcWI1QnNYai9SUHg3SUlkTGVSUmFjSDdZMmZEZERIRWpZckNwSW9HUjF3WkoyTjhsUWxQNnZadFBvcjB0K1NIOVFoeWxlMkFubUdkU0JQRTZBcDFoYWt5L1Q1MHhpSi81N1hrNThlaWg4UklXT2JUWTRWOVhYR2dIZTVBUzhrZkNkOVpuK3BaOUR5bVppQkZOQm1jTko5NlNpdU5HbmE4eGhuRXk5N2pOczdROVljNEp2anFSU2NWVThUOTc3LzNqRjR4czd0azRKK2NXWndGZlF2amk2WE4xUDdoVzVockVGOG44RnBPY2dRamdsYno2RHJ1TStwVXBIMThvd29CYTBoT2ZLcS9EaCtyeVcyQ3dLYVc3MFlqNC92WGR1czRsa0VwQ3diVlFtbUdkazRsNHVPNWp4SXl0aDZ5RXF5K01tVEh0ZU1jZ2dRRHBKdW1KeTJLVHNSaWlrY0dPMERDa0NVMmpUUVhSMk1xLy8yNkZKQi9iOGtBdkpYdEp5T1FBU2l3U0ozL0g3eGhuQVY4Vm1ka2FwdXJQUmx3OHB2cm1UYmFQOXBsMFBHRVRmRGRjSElQMnl6YXY1MTlMR3ZCZGdXY1VjVTNyZldzeEZVS2JIMHBpOFllTSt6bGJkcWsvRU03TXoyMjl3RVA3RTFiR3pLL3lGVjlJejJlT3ppM1Mwbk95TjJveEhYTHFqU1NEQWFlTkNIQVAwb1l2Q1dXU0RqSDRSQjBSdDZvY0tmbHZ0UmVDU2JoZHplY1Z0K0ZkSUIyNWp3MEJ2bmx3c0JpeDdjNkJ3R0FqNGw3S0tVQitFZ0E2VlVkcnZLOWFBZmUrUkZFcUlXSnVKbUU0Mkxid0NlT28wL2hjWGZBWU1jMUpZQkxsYTUvU0Z3dVh6RkN5VEtSZUM5SDIrQkViTkczdWtHRjdxSHNHVTJ2WXJJaTlFOFlDY2pYeFdvTzJHVmU4VXNFdjM3b0ZGNmtKYnpzNzNpeGZWeEI3QXBiQTFVR2s5aTFPcTdrM1dXb1FEajMvV3hrRmMycUZkN09rbk9Sb0VKMWlIY2tKdHpDY3VKWUVEVjYyS1lVYnVpWmNMUTFnVnBnSmlScVZ6dXJ1WTZWMk5TUnc3M05IWEhlUmJlU0I1Zys3Vm0zOWI5Y1ZaQlNmL2ViaFNzeHpITGx4eXN1Z25BOGFVUkJvU1hReGdaNitYK0poY1Bma1lPNHU5MUtqQ1J1R05qUlhkRzRBNFpOSWpRSkFPLzdaQ1AvY2l5SXAwS3B4S3U1VG9aOEVMSnpoa09vd0h0aUgvSzdvdUk4QTEvNjV4YUxxaXpUUllsSnBDR1c1VExDZzNySGRxdlluQXNwL1Q0elNTMTY2SmJMU1hSa0VEc0ljN3BXUGFjMFdTRWVpVzRHUU1oRW1Rb2xZOFVsTGhscmJybmZKaXNwaFpLN1VOM01MOWZKQWF6N0E0UDk1QmREcVcwckJScUVRdzU2UzlLVTk4NVV2YWt4NG9Da080WlF3ODdpSmdhNk10S1dlcmxMOFM0VlRHbm9zRU4xQkdLY2VTcWl5ZjIxU3ZubUJxQ2hzT0tDeTNscHlVVTcmSjBPRSs0bWczUVFyMmpIRzZaamNZUkUyQlJrPQ==; _b="AZXT0OF0ZCpDCoGaFDLIDOnxuF03SODfSqodwzx3CPTk77KqIjmP5dPQvI0b2OGXbig="; csrftoken=32604e7060850646f4d69f9cd0d7b9ce; _routing_id="93bc74e7-e140-4f6f-af8a-6709d1a078fb";`,
  csrfToken: "32604e7060850646f4d69f9cd0d7b9ce"
},
  {
  name: "ananya panday",
  tagPrefix: "c",
  cookieStr: `_auth=1; _b="AZUIBrlMgHFJeKZo1X/oyobJsd11Nz0hDKoBy7rlTxsqaPx/002WRmWtw3WtAK3FX1s="; csrftoken=53756b0a8869eb01d04930f57fe4c32d; _routing_id="5a57589c-a3c9-4bbe-8303-9c2326bcd1b5"; sessionFunnelEventLogged=1; _pinterest_sess=TWc9PSYvUVZzcUpnQ1ZHREplbzdpS2g1aVh5TXVCZzVmUC82ampOKzN5SkNlMUFwTFRJVjBXRllXL0tqdnBhcEFWZG5VYUVibUU2R0luQmM0V1NlS1VEb2RyRUdPdEpvalNIRWhrMDlNZFZGZkE1VmJNbVhrSi9ROXkrS2drNlZwR0lZdXFTQTRkU3BOaHhnTTlob0FYR2tXTVp4QjFwYUhsWDdxc3h5bU9FRm03Yks2UnA2c0tJL2NnYlZ0dTFZYWhjMit6aFZqV3EwcEs1Y1Q2d2NtRmVDUTRUMEJoOVkrVUNUL0ZYUFE5ckRhaTkvZXRJalEyTmZFcFFtZ2toOGNlTjJzcDJUYmVZOSthWEJ6RVJ3U3RjUUpONUZTQWxpRERSYnlzWDJONThaa2Rxa3l3WFFPMmNXWklUMWp3bXo0aURiYzZ5R0lIVjFlM1IrYkVQVGo4Sm9uZHlnTkNOYkN4bmljRUl5QkFjN0dnclg1VTRLb2ZMUWZxRG5DemFpQkVDSVpqeWtvYUpENDVrWXZkVHdHNCtJT1VOMW1mR0tkcWVZcHZZQTd1eVRzRytmZHhWWitqbmg4RE45ZnhoaytJSk9uOEV5eDZNakdGcWhqMXl1TkVDd1VWazM3N0pjeEVCSmdXTElRaWowcDVFTkNhV3ZVbVVvalRRQ1ZrT0d1Ti91YmlUbWZRV0VXZExrLzlrTHZQT3lVMlRlVCtMYUh4MkVsVWpmeEJJUEVzY2EydnFDSXU0dTAwQ3F6RW9HaFM5NmZ6dSszNk1FeW9CL0NqQ2pSbk44a3ovSmVMQ2RIaktUc2I1T24rK1JWVzFMUlFlVkRCN2tjQVB3Z3FzUlU2UmwyRVlIV0JzR3dERmFubWZ3c2xCcU9PM29XdG03b2F1eW10empyR01FY3Fudy9lNVkrQ3hDVU9OcFphMlUwYjFVYVVJSnJQYko0NFRFejAzajBnczBxQ2pCWjlSMTQ3RkZpOTh0aERIalVramNLanArYkZoMlFsS0R2OGhET2M1WHFyTUxYOVNyd2dxRmRrSUp3K3lMS3RMc1ZKVGU2dlJjM2dERlZkbnkwVlZVVVN0ajlicE50RHhEMlFEQjExWHFiTmR5cFZvV1kwNFhlSXpFZWZaeUh1VWlVbVN5SVBjaVZnQ0FzTmIrV3Y0aExhMkdralN6eWZxRHpTbGhoVWRwNlJhbGpzM3A4TkVxcWxrQ0VCOU8yUVROc2V6dmhBQ3dTZFNNL29rQis3b0FWVk1mZXZkQVEyeUZHRWhQalp3UldNV3NFdTNRKyttdE02ZStGbTR1OWt6cXkxbkVFT1d2V0RsZjlERzlUUHBBUkRNQ3R0ZHp1MUN5TUVhdGc1ditJWG1xb3F6VmhPcElCVUxBd0JUdXV2TFNZZDVud1dacVp5dktBMXltY2NpRHBkbUNpeWpobTlDWDJHU0ZoTjkvN3d0NmZoWG5ITmROVHI1SnhRV3dxTDF1bUFsOC9MYWx0b29jTCt6cVdrME82Y0JDU3JQZjZKTTQrSUphelJaZy9uZUwzalByS3ZYMTdnRldvcGhNTmdIS3Q5dzFURlFNNHBhQ0V3M1VJUVh1dEZLSFpXWktUUDZWSXhkM29sbUgzY1plQTdzLzl6RUVCMXB5UGRodVo2WHUwOGFCTXdFOC94MFhSMmZTaS9udmxDU0xKa0NlWkYvRk0wYjRmT1kxeEZBcGI5Y1dlN1Mxd3daWjlHdG01ZTM1d3pJNzU1Y1FyR3dIbm9ZWFpwUnVuS2lKRnJqcm10NzFiS1RhdkdFSHkmd2Q2VEYyMXYxUHdkOHV2am1XZlFpTE5ydFk4PQ==; l_o=ulXwVbKtgONMu8Ik3HlRJQO9T9aCIr0Hz1NMiMTTlzQEnecWlGv/fHJIWvgBdrn8D0dnxg738ArPgiHQQ8DEDB6FqVzqHQw0RzCumuh2JHUVGcau8rUTmJpDS2E1MRWfpdIX/b0=; __Secure-s_a=eUY5UDVIOVljT00xTlErMDh5SE9CencvTFY0M0lESm9GdEtUSkg3ZkNLV0pONmZBNUpGTUtNTWxTWDd0d253WTQvSmZEeUppbFhzbGllNXFkT1o5bnR6WExNYTYrZ2VBamZVM0tnUGxzWjhmQ0l6ZHlWSDA2SFdjUndNTS93dGpVSVJMK1Y3U2YvTVBUc0d4S3h4TFJnd09haTMzMHBXMmxJd2tOL1JEY3FNcmc4U3pFV2k4eVUyZVhSZGg1MEZWZDkwa3lvdU5rYmtiTUlBVGRPT3RjMVJ5d0JuZGtpUStvV2tuVU1vTGlyMldUQml6Z0tOQmNVaEJ2WkZlNUV1YWw3T0xVdzMyRUsrL1hoNkdxamVOQS8rVXBjUGNVWFFUK0lsQ3pzN1Mxa29maHVCTzRjSEM5Q1NlSlV6UGh3cjRzN0M5UEdVVGpFdGNqTUlzYmF1enJHRHgydWNZWTdMdWJaRmN1Qy9xMkhFTC9lSnVZS2hVY2FxWng3ZVFyeGF5VDhVL2hIbCtwTVNiMXFSRTgwd1pVbkowOGFvOHRZNTh4eUxiZE0yVVI5WVMvakNpTGRGWW9UUVVTWXhVbVN3YTMxZXR4TmVSaU1GSFNBYnBXdEFveStOWWwrWUEyZ1JOVHVHcGpYYWc3c1huMWxSMWZuMWpuREFCem4rSiszbmp5Vk4zQUJ6ckZoUUVEaExPdGswdURFTDlLVDMvVm03R1ZSSm4xeXltVEN4R2NyT2hxakQrSGVMWEpVanBrakozMjAvNmlSOEJCM1RFQXpWZlY3cXJ0d3R0R09ydXROTmhPYk03ZXNSamRiQkZ3ZlR0Z0lxNFlwT2VGcDd0VVBKWVVCY0pvTThYTEZESGYvMkJ3WW44bzhyUU8xM1pxSFEreEI5S1pKU0ROOGJqcmt4bWFZcmJYNjRaakhMdjdoVXJFcXJuWFZMN2YvZlFQcmE5eGorbWFHTFlBendNeFl2eGNyL3RxQlNqU1JScXJ1ZkFjenV1QnR3VkYrZnc4dUtxNVBlWFBTNTZBSnpML3Zwa0pOL3pKRkRsb2tma1ErbWQ1dW9uU2FNcGpyTGpuay9lN3lpeDVhZTM2Mm02WUFPYnpvamV6cUpBRDcvOGk0RjhZYXZJRHRNTmZUYXFTTE9lYmlWN1pBdkxWOTlnWGxLSitsQ0V5TUc1WmFmU2ZCUVM1eXA2aSt5LzRkcTBkaUpSUVdKakZMSjBEZEIvTkFVdEdBS05qeFFEeHdhSDBoY2F5bEZCc29nb013WCtBN3pGdThMT09YOU1jRU9PZjBlMzdObjZHcS9GMlJRVVZtbFRyUXlrQnFkd3ZzZz0mdEd0ZXV5VVAxeEtCZnFhZXJnN3E4U3dXeGNvPQ==;`,
  csrfToken: "53756b0a8869eb01d04930f57fe4c32d"
},
  {
  name: "cristiano ronaldo updates",
  tagPrefix: "d",
  cookieStr: `_auth=1; _pinterest_sess=TWc9PSZpMVU0bDFCeUdSWU00WjExbjgyeUY3QmxOSVptdjAwVnY4YURWWmhmUFJWTGR5SkhVeHRvTmtTQytwckRiNUIzSDR3WHN5b0hmY0EraVlCYXhqWlZuQkc2ZDhZZ1F5dmRnUGc1NW14aXlhaU1hbTFZdTB2UXBDdjVhczNPSUFJcUVmbVlWRXd3UlJ1NlJ3aWdWLzNBb0ZTV1BxY3FkUFI5M1h5cGU0ci96NU56cVE5NmpZNlRJNlVIQ25KM0ZicTR3Z3pMRkNXNEczR1g4U0FFY3ZoNjJleXdOZGduVjNRVTk1cXRkbFQ5UXk2cVRLeiszdGRKbzdkbGgrdkVpREs4YzJ3c1RwaHRxU0J5eUdDU3R6LzlaTDFXam9HWG43N1RMQjdYOGg4TzEzSER0YWwwbG01T3d5RVUzQUZXUHFMc2NDVFlrN25xbGxaTXdFcXp5NEMzK1Zzb0dVb1l4Q1NxTHRKd2NZWnoyTUpOR1IrSzB6Zmd3Nkg0dnNZa1luQ01ybmxhdk54dDJFQlROR1VMZkNhWmJKWlBOSTZYcnZsSlI5UVRCdXhmTjMrVUpDb3A2NXBTWU1HbU1ZN1k4dW12WkREbkh4U2xXd0pEMHkrN2Zud29LTlM2L3p5cEJjVTl5WXhpY2dqY3d5RnNSa3BLYWhVNkFrd2x3eFZPTm0zTmdXK3FiMUR3a3dlZnZVdDZZakdJZU1taVdvNkFJZ0lUTGR1VHJvUnJvTElJa2JsSlFkQlRhZCs3OG50bjBXSzVaYVI0aW9xaW95WlBtd1VsSSt1cDlod2IyajEvcmF1WlQ2MkRWQmJIU1RUSEMzcmlrNlFzckMzZWtZZlNFTHJJbFQ3QldneXhabjA5NGcvdjBPMGdsUUs2cGJ5RmltdDF1cjVrQ1lmOXMyTU1lT1dFa3cvMFl3MzJLSHFjaWc4aytsaCt0QXJKM05oZ2hZT3pvdFV3VnBERTFZdDlYNlJCWGd5dHNUQ09xSHJZL3FBM1lWdFpGMTVMQTk2N094UGtIazZydTh2M0dEdU1MbFM1SHRmQjJ1T3p4NFplcUNrdHgxdU52b2haVTNDb0cvRjkxUktUdW5HV3NmNG5HMmRxcU1TVk1TRnVzUVBxb3hKc3Mrb1QxWENtZ3F5b2hLc3B3ZEJiTDlLa1NwYlZERmRFSjV4ZnlUN21KTnpqNlFuYkk1WGNCWlZrQ29uQ0Q0QTFoQlh1dERzalNpbWNEZWllTVVORnF5S0RqMjhWL1QwQWtDTUdRc1VrM2VaRWRXZUUyRVBUM0c1NGNBb0g2MmFvbmswMDVvdzVWTXQycjJXOW9NSUg3UEh0WW5oZ0djWkZIRjRSMUZrdmpHV2RTaUxIRXZzWGp2NHZEUGI3RlAyckZmREFUb09QMUJ5NXE1dGtRb2I0d1ZjQXBSUzRwNU50N3J6R3JHcUI0ZDF0UXlaT3NkY0JMbERYWmkyR2h1U0hYek9LZkJvOFBJSzhFMFhiMXZRRkEvZW9BVnp0N0lSS2dPU3M1NWxhNzlkblNhclNtaWVMalQ1Vy9KRVkzUmZHdDN6S1BNaW1ibDZWVi9PbmdwS1o2MmpaWW5WN3JydmY1MXY4a3dXWnRWTEM4Z20wZUlvTXZnd2RmOTdGMGVFSWY4Z212dE85K3E1d2JNNk5qTFpLelNHamtTU1RhaFdSTm9Mek5Kay9sTXB4T2MwaWMzbUZ4eG9ZMXhNNllQdUNpZ3lVUHBYUTJDcXJRSmJkMktrdng3NFltVmNjL1hycnRwT3R1S1RPeGcyT1pMbmkmNGtROFBsd2Q1V01jTWIyQUNqcmFXWmZ0enhjPQ==; _b="AZWXP4JeR09IKbo+S1qJltUfqSJ8phaebROhkjddWDyjZUunkbSD8O5QljHdcrldZmA="; csrftoken=b38d8b9dd90121ab4778b3814a1eb8b6; _routing_id="b0864352-4ecb-4d6d-8bea-6569dcf04354"; sessionFunnelEventLogged=1; l_o=ulXwVbKtgONMu8Ik3HlRJQO9T9aCIr0Hz1NMiMTTlzQEnecWlGv/fHJIWvgBdrn8D0dnxg738ArPgiHQQ8DEDB6FqVzqHQw0RzCumuh2JHUVGcau8rUTmJpDS2E1MRWfpdIX/b0=; __Secure-s_a=OEdwaWJSVWxsNnZWRGhDL2dQdHg3aGREZngwOW9XWUZSSldrZkl2SndyYjZJR1dwcGVlOEZJQTV2VGVmbHVRbG13WElqcXlSa0JCZjdkY2dHRzd6b0NBVTdJVHZjL3ljVzNTK05VMThWSmx2Y2dhNlZTY0JhZ1VPRFA4NVpXUUxwdE55Ui8wanJiNnVmc2ZyQkgwakJlOEgzRVhQbjJzb1B5K3F6ME1JdTlnZllYQm9ndnc1NSsrYmZ2c3gyNVQyOGJySHNKUzNUMzhESkJUMTRrUS83VWxnbTdqRUtOZGJOOE5ObGJBeGVrdEVEb0xwQlYwQTR5M3RmVHRLQzhKZ2RPYlhkVWQrUUx1SGxwNkNzWHA4Sm5qazJPL0o5dHZnZ0JmeUZsVElOelZ1Y2hsSFZibVNtWTNaQ0k3b2dQdERHaElLeFNNSmppdWZDN0lvb0xna0laVmVqMHdHNjJ1NSsyTFJvaXdndkRSYXdDQTcvUXc2cXQzWGt6MkZXTllrNjlEUHFuNlhnT2gxdXJlcHRocTdjYUdrNHZ0MVJrS1dNQWp2ZUV1QXQySmVJcEtPaWV6MXFDb2FBVjlJUW0vc1MwSytnU2x3SmJtMGtUN2J1eW9PQ2tWenozci96NFBXWlUxYWNId0dOR2xhOW5NdzgyTFRVU2M1TncrN240akJaeERHN1Q3Q1hkN2RueVQwc3BMbG90U1VxMElEaUwwNCtoRmFWaU84SlVhbTc0TGpPRmg2dnhaQ0RSeVBRblJENGNKNyswZlFFWnZUWW9UWlIrZEdHRWl3bXFIUlFzejNiclh4aFZuOStVSTdXTFZZaEo2TFBhSU1QZ1NMYXVmQ2JsRmpUczFIZWUwUDdnTHRZdEphSW1BTzFhRzVwNEt6alhEL3NFMHE3enBGVlp4MUU0eXVHRkFkeE9ERTl3UkFTWGVybkNhUEV5YUFtRWlKRDZCVGU5WUdhUlN1dU4zK25SZEt3RWFJK29qcW9tWW9jNktQWmFCUGx2bkhaMmY0aGVtU2tUblhzVjNhUUh2bk54VnAzUEFGWlR3TUNkdGtLclB2VHZIbDVST3VUZnpFNWFUV0VlZWNmTWFuZEF2MGtMQlFwUldqK2xqUlUycDNPa3d1L1IySDRQdGx6VnhSeGZCaDlLelRNZGxVL3lyc3Q1Vlp6ZXptYjh4czNkQzVDdk9KdXlCVktrcUpCVElPd2NBL0ZxWWgrNjNDRkFNTDd0QzJxakdoT1FidjhSRzBmREpjN3BTbEl5cm5BN2VzSGxJcE1CN25ZQmtsVTcyZEhvM2JSQklCSEtuV1ZXWTZiOHg5aE5ETm1mZz0maXlPZTRpb0RwRnYvb003WmdsdUNJTFpNcFZJPQ==;`,
  csrfToken: "b38d8b9dd90121ab4778b3814a1eb8b6"
},
  {
  name: "bharat224055",
  tagPrefix: "e",
  cookieStr: `_auth=1; _b="AZXIou+MbfROi7hIahzYWeRac3+JV0mMFxXnetTQhzKvyAiBQxWMK1SbCOZt+q1stfY="; csrftoken=f77d627ff84ac7d5a3f4d186eb390376; _routing_id="5db27d9e-c8ce-4fe0-9afa-f40b0e617a15"; sessionFunnelEventLogged=1; _pinterest_sess=TWc9PSZtSTZlTUNubHRzblQvaFFnSFRlb1cyYTlOWXd3eDdDWUJsZHZ6U0xLbHdmeHJJYmZDMW5xcUh6dDZ2L29mQTlqOVVIQWpGNXFqNkNpSFZqVW5veTRtZE4zblEzMFUwcHJBQzFUVW5vaURpR3IrMzBHdUhsMitqY0hKVjNvUEJYODcvU3IrakQzZmxsL3RmQmJOd1VDSFB2TEVWM3FrdURGam1CbUpOOXhLT0hoVmgwNnZJTmw2RncwUjc0dzZpdzkzRFNOSWpGUGdrR1dEZnRsVDV2YlExNEJYN2N5c2s0MUc4b212WVcvVnd3MElKb1RLaWdHQzlqbVFFZHc5ZHBnSWoydE0wUUVLY05Ha1BpcDU3U0sxR3JPUVlld25hd3lpaXhKQmhEUGVVRXFSRFFmK25aMFg2UEJxQVVwbFRzNUVyaUREU2VrNzR1QnBzSUlBc3JoNlJNd29RTVIxQ0MyWmRCenV6WG1rbmdwcXJ4TmhVeFNhVWFVQzJmSC9NTjJCUVJZU0JZL3lQMmFNb3ZYK3lkd1BoTHV3SVhHOFFrMy9ZSmRWNDAxTVRaNUY4MkUxSFJrNHBNT2ZTa2JCZ2JVS21TVmRTQVpwaXBCclhDZWhObVFLWDFLQkNQK1RlWklNVGJwcnZLcitDaFhUc0YzRWpEVUNxMExTYmd5OHg3M0daY0MyZisrWkI0WFBKZjkvZEdzOHh2bTM0U0pmVVY3QXh5amFRY2hzZHJpSlFXV1E3UHVOdnFPU1JHVzlwazdpOUt6K3lsVHQ0eDlDUFNzcWhHQzlxVmVjOUsyQW1hYjFMUXZybXZ3NlNTd25tZ2gwQUZFcTZjT2R0L25VbFhpUnRMcmExRUUxVHBQQUFwa3ZZcTNRdDVsbXRXa05FZHRSVU1hVGkxUGdDZTZISGVyb1d4STNJR1laNlJiOGFBMkRGU25aQ3AvVUtxd292bVZaU1J0VmJjTFdSalFzQ2lKRWtYaUFmdzB5NlNlM1Q0MkJDTDV0U01oNGRGa0FIRzNjNkVqcTJFeTg0NzZ3QUFyQUsyNHYvVUh2ZXFNZ2plNWlLbXVNdkdYTlZNR2JLamNEMHpBK2h5Vy9uaElhT1VnTmNLcUt0S3Eza0I2R01oakJyRitRNmxzUXE3UnRkUGZoVm1jeHRuZHNyY2lqSGx2TFhGMnlxS3RXZVJTWDRhMkdHbi9lTUJCRDlCOGpzY05nTW4xdnNBdDR1d3ordTQ5Tis3Y1lyOWVlOVdUZFhHRDFYTkxJOHpPOWkveWxCdXpDYXB0bWpqemhtZzZCRFdFZ2V0ZWw3MkFQUm45MmJPbXdaK29uNFpySmlrbUtZVUVENzN2aWNIYWROL2xFNjVSMnd6Y25YeDJ5cXl1YXFPVUpGRDBVcTJXaitzdXpsNmRSU01nalEvYVFiOFlMMGMrZWh6bVhqaW5NdEZIWEhZbFEwYXpBa1l4VzlHSHRWK3h2U3VXMUtRNEtDdzlZbmFJNW0zNzhqSUFPRDFQZnZmRE9MYSs1NDdKcTNpOGZXb0E3Y29Rb2h1bXlsUnprV1I5bit3b0RUZ0pLTmcrdTRTbGlmUThxUjBtTkNBdUZyUmVKcXpIRjNtelJyVDBBa0I4TXFmTDNGWGs3QXZ2SkxkN2xWeGdDWFRMNlI5ZW9lQk11bzJ2ZWJvZ1V2a2NBL0J3cGxhWmkrdFZMOC9Mc0UvRlpaZ0VHbzU1NGdtOXZlWmZ2QSswNDdtVHl5WlJDc2hvWXlEWjJXbWcwM3pHbVBIbllqS3JZcU9ScFFic0dyZjkmMGlMRGpZSnphSVZLc2VhV0FUbmFwRmFhOUxRPQ==; l_o=+bzMYhnN592nHdz8H5I6ApHorCfuycP+1QEqBKpBBAJp8eyc2d/+FvuFuTFsmkmfLKMVXF4x6y0dW/dqGCGY7izGDn0pzfSt0TV5H5aKtOY6VOFyE3XqsK2dWNvmsj+VULmeiAw=; __Secure-s_a=OVYyWEx2ODZJakMrOHhZNGVJd0I1U2hKZ2wwVnlFRUY1NUtoY1RNSnl5Ly9HMFV2VDFkaUs4WDlGOVQyL2ZXaHRFUVJRczZnbjMwU3dkZEhVb0ZnTEtDTXJHRENEbHY4UDU5RDNPZjBKYTB1T1k1ZklOUVlwcW9ZdWdNT09FZXJkaGgvaC9RWWJsMHJWU0NJa0ZZQWxqVUl1RzVUeHdKMlFJVTFDWWltdHgxSncwU05KUi9OeENSTHc0dm9Gczh4aXkrZnJhRkE1aDR4QU4xekhQTmZaWXJhakJlQVRYeWJLYjNNUDNhQTFleDFkdmh1NFRLR2Q1SjZFc2VqeC94cXZ1MHF1NE0rS0dGUERCcjh1R25yTDVySXRFcEhjd0N0dXUwTU1aZ3lOWHlzUllMeGRKQ0RYVjNmOWZBY0lqQXBuL1kyc0ZTSjZSY1VMUmRhc0ZpNnNDMVJwTWFKL3EzT0hhaG1uNEsrSWFmTUFYMkk2NzM2aHdrVFNZcC83OFZpU3EyTklNQjVNQSt1MnVnZHJZeGNYNzQwby9HQWpaU1Z3ajV4TzUzUUY5ajU3dGdKOXMwQXFDaFdpUmtpVUNiQkJTOVlVZGpxUnVWbis4dFNCSDc1OGU3eVRuVFpOcFpYNmRQdTBUSnBmdkMwcUd2bFl5ZnlPSmlpdk5jRFh5M0FYaXNLTjZ1Qkt4RlpoRDVLSkhMWkZkOWlaZUw1bko0aXlFREI4b2dDaFk3QnVUMkpIYzZ6QjV3SkRTaGpxc3d3QTNXcVRXWWdGcElSWHNVNSthUG94ZEhUTVNDYTZQUE5kYWVQeStLL01oUGkreW5QK2piODRybHNLVkJPU0Y1N1ZKaGN6Ty82OUYrK1ZxRnVNM1FwRkROTmZBL2kwaXZ3UlVSbnFqTTViN25MMjFIZEdpLzNkNmkwWEY2WHFWbzJFbUtGUW9IS1Axc0ZVR2hpbXlOREt5SGtROWdCZXluVnQ1WE04WVdQdTM3MTAxbTlTZzQ3OTVZOWlXMGZ3K1QzY0RKdGtncC9PQkVEbVpsVTJoMnFCRlNBMk9CdnpBTEtCdnAwWWR5OEJVTFdONmUzQWdnK1NkcXMxeGl5emR2ZkpTSEVuNDVWSjJFTEVwYTNtQ2NIL1hzR1RFWnR2eUt6VlMvK3liTUJDWkRFSUFqMEVsRktpMVNvWk1VK0YyUDFoSlhTdUZjQnpxR21FdmJZWkQrQXU3bU5sNnltLzNsMytHbFh0UWl4SEpuWjNyN045ZXRtN1VwZG9YQ3NYV3lWdWJzL0pkZzNBWlZ0enhBemYvR3F1REVoS1RBNzNaL1FDL1YvS2Q1d2tlND0mRTVvUjF6ZjZoTWRrRmFkL09ncVlzczhYVmhJPQ==;`,
  csrfToken: "f77d627ff84ac7d5a3f4d186eb390376"
}


















  
];

// Random sticker picker helper
function getRandomSticker() {
  const randomIndex = Math.floor(Math.random() * AVAILABLE_STICKERS.length);
  return AVAILABLE_STICKERS[randomIndex];
}

function extractPublicId(url) {
  const match = url.match(/\/([^\/\?]+)\.mp4/);
  return match ? match[1] : null;
}

function timeSince(start) {
  return ((Date.now() - start) / 1000).toFixed(2) + "s";
}

function getHeaders(acc) {
  return {
    "accept": "application/json, text/javascript, */*, q=0.01",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/x-www-form-urlencoded",
    "cookie": acc.cookieStr,
    "origin": BASE_HOST,
    "referer": BASE_HOST + "/pin-creation-tool/",
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
  const res = await axios({
    method: "GET",
    url: url,
    responseType: "stream",
    timeout: 60000
  });
  const writer = fs.createWriteStream(destPath);
  res.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

// Local FFmpeg Rendering with Anti-Duplicate Micro-Tweaks
function renderVideoWithSticker(inputVideo, stickerImg, outputPath, accIndex) {
  const contrastMod = (1.001 + (accIndex * 0.002)).toFixed(3);
  const brightnessMod = (0.001 + (accIndex * 0.001)).toFixed(3);
  const cropPixels = (accIndex % 2 === 0) ? 2 : 0;
  const uniqueMetadataHash = crypto.randomBytes(8).toString("hex");

  const filterString = "[0:v]crop=in_w-" + cropPixels + ":in_h-" + cropPixels + ",eq=contrast=" + contrastMod + ":brightness=" + brightnessMod + "[base];" +
                       "[1:v]scale=" + BANNER_WIDTH + ":-1[stk];" +
                       "[base][stk]overlay=" + BANNER_MARGIN_X + ":" + BANNER_MARGIN_Y;

  const cmd = 'ffmpeg -y -i "' + inputVideo + '" -i "' + stickerImg + '" ' +
              '-filter_complex "' + filterString + '" ' +
              '-metadata comment="uid_' + uniqueMetadataHash + '" ' +
              '-c:a copy -preset ultrafast "' + outputPath + '"';

  execSync(cmd, { stdio: "pipe" });
}

// Extract frame for cover image directly from rendered video
function generateCoverLocally(videoPath, outJpgPath) {
  const cmd = 'ffmpeg -y -ss 00:00:01 -i "' + videoPath + '" -vframes 1 -q:v 2 "' + outJpgPath + '"';
  execSync(cmd, { stdio: "pipe" });
}

async function fetchUserBoards(headers) {
  const payload = new URLSearchParams({
    source_url: "/pin-creation-tool/",
    data: JSON.stringify({ options: { filter: "all", sort: "alphabetical" }, context: {} })
  });
  const res = await axios.post(BASE_HOST + "/resource/BoardPickerBoardsResource/get/", payload.toString(), { headers, timeout: 10000, validateStatus: () => true });
  const boards = res.data && res.data.resource_response && res.data.resource_response.data ? res.data.resource_response.data.all_boards : null;
  if (Array.isArray(boards) && boards.length > 0) return boards.map(b => ({ id: b.id, name: b.name }));

  const fallback = new URLSearchParams({ source_url: "/pin-creation-tool/", data: JSON.stringify({ options: {}, context: {} }) });
  const res2 = await axios.post(BASE_HOST + "/resource/BoardsResource/get/", fallback.toString(), { headers, timeout: 10000, validateStatus: () => true });
  const boards2 = res2.data && res2.data.resource_response ? res2.data.resource_response.data : null;
  if (Array.isArray(boards2) && boards2.length > 0) return boards2.map(b => ({ id: b.id, name: b.name }));

  if (res.data && res.data.resource_response && res.data.resource_response.error) {
    console.error("Pinterest API Error:", JSON.stringify(res.data.resource_response.error));
  }
  throw new Error("No boards found for account.");
}

async function registerMediaUpload(headers, mediaType = "video-story-pin") {
  const clientUUID = crypto.randomUUID();
  const payload = new URLSearchParams({
    source_url: "/pin-creation-tool/",
    data: JSON.stringify({
      options: { url: "/v3/media/uploads/register/batch/", data: { media_info_list: JSON.stringify([{ id: clientUUID, media_type: mediaType }]) } },
      context: {}
    })
  });
  const res = await axios.post(BASE_HOST + "/resource/ApiResource/create/", payload.toString(), { headers, timeout: 15000, validateStatus: () => true });
  const dataMap = res.data && res.data.resource_response ? res.data.resource_response.data : null;
  if (!dataMap || !dataMap[clientUUID]) throw new Error("Failed to register media upload ID.");
  return dataMap[clientUUID];
}

async function uploadToS3(uploadData, filePath, contentType = "video/mp4", filename = "video.mp4") {
  const form = new FormData();
  for (const [key, value] of Object.entries(uploadData.upload_parameters)) {
    form.append(key, value);
  }
  const fileData = fs.readFileSync(filePath);
  form.append("file", fileData, { filename: filename, contentType: contentType, knownLength: fileData.length });

  const s3Res = await axios.post(uploadData.upload_url, form, {
    headers: Object.assign({}, form.getHeaders()),
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    timeout: 60000,
    validateStatus: () => true
  });
  if (s3Res.status >= 400) throw new Error("S3 Upload failed: " + s3Res.status);
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
  const res = await axios.post(BASE_HOST + "/resource/PinResource/create/", payload.toString(), { headers, timeout: 25000, validateStatus: () => true });
  return res.data;
}

(async () => {
  const totalScriptStart = Date.now();
  const baseRawVideo = path.join(__dirname, "base_raw_pin.mp4");

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

    console.log("🎯 Target Video Public ID: " + cloudVideoId);
    console.log("📋 Base Caption: " + chosenRow.caption);

    // Download RAW base video ONCE (Zero Cloudinary transform credits)
    const rawVideoUrl = "https://res.cloudinary.com/" + CLOUD_NAME + "/video/upload/" + cloudVideoId + ".mp4";
    console.log("⬇️ Downloading base video: " + rawVideoUrl);
    await downloadFile(rawVideoUrl, baseRawVideo);

    // Sequential loop across Pinterest pool
    for (let i = 0; i < PINTEREST_ACCOUNTS_POOL.length; i++) {
      const acc = PINTEREST_ACCOUNTS_POOL[i];
      const chosenSticker = getRandomSticker();
      const tempVideo = path.join(__dirname, "rendered_" + acc.tagPrefix + ".mp4");
      const tempSticker = path.join(__dirname, chosenSticker + ".png");
      const tempCover = path.join(__dirname, "cover_" + acc.tagPrefix + ".jpg");

      try {
        console.log("\n============================================");
        console.log("🚀 Processing Pinterest: [" + acc.name + "] (Prefix: " + acc.tagPrefix + ")");
        console.log("============================================");

        const headers = getHeaders(acc);
        const boards = await fetchUserBoards(headers);
        console.log("📋 Found " + boards.length + " boards on " + acc.name + ".");

        // 1. Fetch random sticker PNG from Cloudinary
        const stickerUrl = "https://res.cloudinary.com/" + CLOUD_NAME + "/image/upload/" + chosenSticker + ".png";
        await downloadFile(stickerUrl, tempSticker);

        // 2. Render locally with sticker + unique visual tweaks
        console.log("🎬 Rendering local video for [" + acc.name + "] using sticker [" + chosenSticker + "] (Unique hash applied)...");
        renderVideoWithSticker(baseRawVideo, tempSticker, tempVideo, i);

        // 3. Generate cover JPEG directly from rendered video
        generateCoverLocally(tempVideo, tempCover);

        // Direct concatenation: Prefix + Caption
        const targetCaption = acc.tagPrefix + chosenRow.caption;

        console.log("📡 Step 1: Registering media...");
        const uploadData = await registerMediaUpload(headers);

        console.log("☁️ Step 2: Uploading S3 buffer...");
        await uploadToS3(uploadData, tempVideo, "video/mp4", "video.mp4");

        console.log("⏳ Waiting 300s transcode buffer...");
        await new Promise(r => setTimeout(r, 300000));

        // Direct Cloudinary raw base cover fallback (zero transformation)
        const coverUrl = "https://res.cloudinary.com/" + CLOUD_NAME + "/video/upload/" + cloudVideoId + ".jpg";

        console.log("🚀 Step 3: Publishing Pin...");
        let published = false;
        for (const board of boards) {
          const pinRes = await createPinWithCover(targetCaption, chosenRow.link, uploadData.upload_id, board.id, coverUrl, headers);
          if (pinRes && pinRes.resource_response && pinRes.resource_response.data && pinRes.resource_response.data.id) {
            console.log("🎉 SUCCESS! Pin Published on [" + acc.name + "] | Board: " + board.name + " | Pin ID: " + pinRes.resource_response.data.id);
            published = true;
            break;
          }
        }

        if (!published) {
          console.error("⚠️ Could not publish pin on any board for " + acc.name);
        }
      } catch (accErr) {
        console.error("❌ [Account Error - " + acc.name + " Skipped]: " + accErr.message);
      } finally {
        if (fs.existsSync(tempVideo)) fs.unlinkSync(tempVideo);
        if (fs.existsSync(tempSticker)) fs.unlinkSync(tempSticker);
        if (fs.existsSync(tempCover)) fs.unlinkSync(tempCover);
      }
    }

    console.log("\n🏁 Multi-account cycle finished in " + timeSince(totalScriptStart));
    process.exit(0);
  } catch (err) {
    console.error("\n❌ [Fatal Error]: " + err.message);
    process.exit(1);
  } finally {
    if (fs.existsSync(baseRawVideo)) {
      fs.unlinkSync(baseRawVideo);
    }
  }
})();
