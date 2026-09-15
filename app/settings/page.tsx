"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Company = {
  name: string;
  email: string;
  phone: string;
  logo: string;
};

export default function Settings() {
  const [company, setCompany] = useState<Company>({
    name: "",
    email: "",
    phone: "",
    logo: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    async function loadCompany() {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("USER ERROR:", userError);
        setLoading(false);
        return;
      }

      console.log("CURRENT USER:", user.id);

      const { data, error } = await supabase
        .from("companies")
        .select("id, name, email, phone, logo")
        .eq("user_id", user.id)
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("LOAD COMPANY ERROR:", error);
        setLoading(false);
        return;
      }

      if (data) {
        setCompany({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          logo: data.logo || "",
        });

        console.log("COMPANY LOADED:", data);
      }

      setLoading(false);
    }

    loadCompany();
  }, []);

  async function uploadLogo(file: File) {
    setUploadingLogo(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Please log in first.");
      setUploadingLogo(false);
      return;
    }

    console.log("LOGGED IN USER:", user.id);
    console.log("SELECTED FILE:", file.name);
    console.log("FILE TYPE:", file.type);

    const filePath = `${user.id}/logo.png`;

    console.log("UPLOAD PATH:", filePath);

    const { error: uploadError } = await supabase.storage
      .from("company-logos")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      console.error("LOGO UPLOAD ERROR:", uploadError);
      alert(uploadError.message);
      setUploadingLogo(false);
      return;
    }

    console.log("LOGO UPLOAD SUCCESS");

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("company-logos")
      .getPublicUrl(filePath);

    console.log("LOGO URL:", publicUrl);

    const { data: existingCompany, error: findError } = await supabase
      .from("companies")
      .select("id")
      .eq("user_id", user.id)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (findError) {
      console.error("FIND COMPANY ERROR:", findError);
      alert(findError.message);
      setUploadingLogo(false);
      return;
    }

    if (existingCompany) {
      const { error: logoError } = await supabase
        .from("companies")
        .update({
          logo: publicUrl,
        })
        .eq("id", existingCompany.id)
        .eq("user_id", user.id);

      if (logoError) {
        console.error("LOGO SAVE ERROR:", logoError);
        alert(logoError.message);
        setUploadingLogo(false);
        return;
      }
    } else {
      const { error: companyError } = await supabase
        .from("companies")
        .insert({
          name: company.name,
          email: company.email,
          phone: company.phone,
          logo: publicUrl,
          user_id: user.id,
        });

      if (companyError) {
        console.error("COMPANY CREATE ERROR:", companyError);
        alert(companyError.message);
        setUploadingLogo(false);
        return;
      }
    }

    setCompany((current) => ({
      ...current,
      logo: publicUrl,
    }));

    console.log("LOGO SAVED TO DATABASE:", publicUrl);

    alert("Logo uploaded and saved successfully!");

    setUploadingLogo(false);
  }

  async function saveCompany() {
    setSaving(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Please log in first.");
      setSaving(false);
      return;
    }

    console.log("COMPANY BEFORE SAVE:", company);

    const { data: existingCompany, error: findError } = await supabase
      .from("companies")
      .select("id")
      .eq("user_id", user.id)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (findError) {
      console.error("FIND COMPANY ERROR:", findError);
      alert(findError.message);
      setSaving(false);
      return;
    }

    if (existingCompany) {
      const { error } = await supabase
        .from("companies")
        .update({
          name: company.name,
          email: company.email,
          phone: company.phone,
          logo: company.logo,
        })
        .eq("id", existingCompany.id)
        .eq("user_id", user.id);

      if (error) {
        console.error("COMPANY UPDATE ERROR:", error);
        alert(error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("companies")
        .insert({
          name: company.name,
          email: company.email,
          phone: company.phone,
          logo: company.logo,
          user_id: user.id,
        });

      if (error) {
        console.error("COMPANY INSERT ERROR:", error);
        alert(error.message);
        setSaving(false);
        return;
      }
    }

    alert("Company saved successfully!");

    setSaving(false);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-emerald-500 dark:from-slate-950 dark:via-blue-950 dark:to-emerald-950 flex items-center justify-center p-6 sm:p-10">

      <div className="absolute w-72 h-72 bg-blue-300/30 rounded-full blur-3xl top-10 left-10" />

      <div className="absolute w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl bottom-10 right-10" />

      <div className="relative w-full max-w-xl bg-surface/70 dark:bg-slate-800/70 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-border shadow-2xl">

        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-500 to-emerald-600 dark:from-blue-400 dark:via-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent">
          Company Settings
        </h1>

        <p className="mt-2 text-text-secondary">
          Manage your company information and branding.
        </p>

        {loading ? (
          <div className="mt-8 text-center text-text-secondary">
            Loading company settings...
          </div>
        ) : (
          <div className="mt-6 space-y-4">

            <input
              className="w-full p-4 rounded-xl bg-input border border-border text-text-primary placeholder:text-text-secondary shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500"
              placeholder="Company Name"
              value={company.name}
              onChange={(e) =>
                setCompany((current) => ({
                  ...current,
                  name: e.target.value,
                }))
              }
            />

            <input
              className="w-full p-4 rounded-xl bg-input border border-border text-text-primary placeholder:text-text-secondary shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500"
              placeholder="Email"
              value={company.email}
              onChange={(e) =>
                setCompany((current) => ({
                  ...current,
                  email: e.target.value,
                }))
              }
            />

            <input
              className="w-full p-4 rounded-xl bg-input border border-border text-text-primary placeholder:text-text-secondary shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500"
              placeholder="Phone"
              value={company.phone}
              onChange={(e) =>
                setCompany((current) => ({
                  ...current,
                  phone: e.target.value,
                }))
              }
            />

            <div>
              <label className="block mb-2 font-semibold text-text-primary">
                Company Logo
              </label>

              <input
                type="file"
                accept="image/*"
                disabled={uploadingLogo}
                className="w-full p-4 rounded-xl bg-input border border-border text-text-secondary shadow-sm file:mr-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-blue-600 file:to-emerald-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                onChange={async (e) => {
                  const file = e.target.files?.[0];

                  if (!file) {
                    return;
                  }

                  await uploadLogo(file);

                  e.target.value = "";
                }}
              />

              {uploadingLogo && (
                <p className="mt-2 text-sm text-text-secondary">
                  Uploading logo...
                </p>
              )}
            </div>

            {company.logo && (
              <div className="flex flex-col items-center justify-center pt-4">

                <p className="mb-2 font-semibold text-text-primary">
                  Current Logo
                </p>

                <img
                  src={company.logo}
                  alt="Company Logo"
                  className="w-32 h-32 object-contain rounded-2xl border-2 border-border bg-input shadow-lg"
                  onError={() => {
                    console.error(
                      "LOGO IMAGE FAILED TO LOAD:",
                      company.logo
                    );
                  }}
                />

              </div>
            )}

            <button
              type="button"
              disabled={saving}
              className="w-full mt-2 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold shadow-lg hover:from-blue-700 hover:to-emerald-600 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
              onClick={saveCompany}
            >
              {saving ? "Saving..." : "Save Company"}
            </button>

          </div>
        )}

      </div>
    </main>
  );
}