import { connect } from "@/dbConfig/dbConfig";
import Midwife from "@/models/midwifeModel";
import { type NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

connect();

function buildName(first?: string, last?: string) {
  const name = [first?.trim(), last?.trim()].filter(Boolean).join(" ");
  return name || "";
}

function toIdArrayFromQuery(url: URL) {
  const idsParam = url.searchParams.get("ids");
  if (!idsParam) return [];
  return idsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function sanitizeIds(ids: unknown): string[] {
  if (Array.isArray(ids)) {
    return ids.map(String).map((s) => s.trim()).filter(Boolean);
  }
  if (typeof ids === "string") {
    try {
      const parsed = JSON.parse(ids);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      // ignore
    }
    // fallback single string
    return [ids.trim()].filter(Boolean);
  }
  return [];
}

function validObjectIds(rawIds: string[]) {
  const seen = new Set<string>();
  const valid = [];
  for (const id of rawIds) {
    if (!seen.has(id) && Types.ObjectId.isValid(id)) {
      seen.add(id);
      valid.push(id);
    }
  }
  return valid;
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);

    // 1) Batch GET via ?ids=aaa,bbb,ccc
    const idsFromQuery = toIdArrayFromQuery(url);
    if (idsFromQuery.length > 0) {
      const ids = validObjectIds(idsFromQuery);
      if (ids.length === 0) {
        return NextResponse.json(
          { success: false, message: "No valid ObjectIds provided in 'ids'." },
          { status: 400 },
        );
      }

      // Optional guardrail
      if (ids.length > 200) {
        return NextResponse.json(
          { success: false, message: "Too many ids; max 200 per request." },
          { status: 413 },
        );
      }

      const docs = await Midwife.find({ _id: { $in: ids } })
        .select("_id personalInfo.firstName personalInfo.lastName")
        .lean();

      const map: Record<string, string> = {};
      for (const d of docs) {
        const name = buildName(d?.personalInfo?.firstName, d?.personalInfo?.lastName);
        map[String(d._id)] = name;
      }

      return NextResponse.json({
        success: true,
        message: "Midwife names fetched successfully",
        data: map,
      });
    }

    // 2) Original single-id behavior via ?id=...
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Provide either 'id' or 'ids' in query." },
        // { status: 400 },
      );
    }

    const midwife = await Midwife.findById(id).select(
      "-personalInfo.profileImage.data -personalInfo.logo.data",
    );

    if (!midwife) {
      return NextResponse.json(
        { success: false, message: "Midwife not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Midwife fetched successfully",
      data: midwife,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawIds = sanitizeIds(body?.ids);

    if (rawIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "Body must include { ids: string[] }" },
        { status: 400 },
      );
    }

    const ids = validObjectIds(rawIds);
    if (ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid ObjectIds provided." },
        { status: 400 },
      );
    }

    if (ids.length > 200) {
      return NextResponse.json(
        { success: false, message: "Too many ids; max 200 per request." },
        { status: 413 },
      );
    }

    const docs = await Midwife.find({ _id: { $in: ids } })
      .select("_id personalInfo.firstName personalInfo.lastName")
      .lean();

    const map: Record<string, string> = {};
    for (const d of docs) {
      const name = buildName(d?.personalInfo?.firstName, d?.personalInfo?.lastName);
      map[String(d._id)] = name;
    }

    return NextResponse.json({
      success: true,
      message: "Midwife names fetched successfully",
      data: map,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
