"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import GoogleAddressAutocomplete from "@/components/GoogleAddressAutocomplete";
import type { PersonalInfo } from "@/types";
import axios from "axios";
import { ArrowUpFromLine, Loader2, MapPin } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";


// If you already have these in '@/types/google-places', you can import the types instead:
interface AddressSuggestion {
  id: string;
  address: string;
  placeId: string;
  mainText: string;
  secondaryText: string;
  types: string[];
}

interface PersonalInfoTabProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
  onCancel: () => void;
  onContinue: () => void;
  isEditMode?: boolean;
  setPassword: React.Dispatch<React.SetStateAction<string>>; 
  password : string;
}

const PersonalInfoTab = ({ data, onChange, onCancel, onContinue, isEditMode, setPassword, password }: PersonalInfoTabProps) => {
  const profileImageRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isPasswordValid, setPasswordValid] = useState(true)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "password") {
      setPassword(value.trim())
      if (password.length >= 6) {
        setPasswordValid(true)
      }
      return

    }

    if (name === "serviceRadius") {
      let cleanValue = value.replace(/[^\d.]/g, "");
      const parts = cleanValue.split(".");
      cleanValue = parts[0] + (parts.length > 1 ? "." + parts.slice(1).join("") : "");
      e.target.value = cleanValue;
      onChange({ ...data, [name]: cleanValue });
      return;
    }

    if (name === "slogan") {
      const cleanValue = value.toLowerCase().replace(/[^a-z-]/g, "");
      e.target.value = cleanValue;
      onChange({ ...data, [name]: cleanValue });
      return;
    }

    onChange({ ...data, [name]: value });
  };

  const handleGoogleAddressSelect = (addressData: AddressSuggestion | null) => {
    if (addressData) {
      const updatedData: PersonalInfo = {
        ...data,
        googleAddress: {
          fullAddress: addressData.address,
          placeId: addressData.placeId,
          mainText: addressData.mainText,
          secondaryText: addressData.secondaryText,
          types: addressData.types
        }
      };
      onChange(updatedData);
      toast.success("Google address saved successfully!");
    } else {
      onChange({ ...data, googleAddress: null });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "profileImage" | "logo") => {
    const { files } = e.target;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    try {
      if (type === "profileImage") setIsUploadingProfile(true);
      else setIsUploadingLogo(true);

      reader.onloadend = async () => {
        try {
          const response = await axios.post("/api/upload", {
            image: reader.result,
            folder: `midwife-dash/${type}`,
          });

          if (response.data.success) {
            onChange({
              ...data,
              [type]: {
                url: response.data.url,
                public_id: response.data.public_id,
                name: file.name,
              },
            });
            toast.success(`${type === "profileImage" ? "Profile image" : "Logo"} uploaded successfully`);
          } else {
            toast.error(`Failed to upload ${type === "profileImage" ? "profile image" : "logo"}`);
          }
        } catch (error) {
          console.error(`Error uploading ${type}:`, error);
          toast.error(`Error uploading ${type === "profileImage" ? "profile image" : "logo"}`);
        } finally {
          if (type === "profileImage") setIsUploadingProfile(false);
          else setIsUploadingLogo(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error(`Error processing ${type}:`, error);
      toast.error(`Error processing ${type === "profileImage" ? "profile image" : "logo"}`);
      if (type === "profileImage") setIsUploadingProfile(false);
      else setIsUploadingLogo(false);
    }
  };

  const handleProfileImageClick = () => profileImageRef.current?.click();
  const handleLogoClick = () => logoRef.current?.click();

  const handleSubmit = (e: React.FormEvent) => {
    const isValid =
      password.length >= 6 &&
      !/\s/.test(password);
    setPasswordValid(isValid)
    if (!isValid && !isEditMode) {
      return
    }  
    // if(!data.email && data.email===""){
    //   return
    // }   
    
    // if(!data.username && data.username===""){
    //   return
    // }   
    // if(!data.firstName && data.firstName===""){
    //   return
    // }
    e.preventDefault();
    onContinue();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <Input name="firstName" value={data.firstName} onChange={handleChange} placeholder="Text input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <Input name="lastName" value={data.lastName} onChange={handleChange} placeholder="Text input" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Midwife Title</label>
          <Input name="midwifeTitle" value={data.midwifeTitle} onChange={handleChange} placeholder="Text input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <Input name="username" value={data.username} onChange={handleChange} placeholder="Text input" disabled={isEditMode} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Slogan</label>
          <Input name="slogan" value={data.slogan} onChange={handleChange} placeholder="Text input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Personal Statement/Quote</label>
          <Input
            name="personalStatement"
            value={data.personalStatement}
            onChange={handleChange}
            placeholder="Text input"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">About</label>
        <Textarea
          name="about"
          value={data.about}
          onChange={handleChange}
          placeholder="About"
          className="min-h-[100px] resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Upload Image</label>
          <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
            {isUploadingProfile ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-6 w-6 text-primary animate-spin mb-2" />
                <p className="text-sm text-gray-600">Uploading image...</p>
              </div>
            ) : data.profileImage?.url ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-2 overflow-hidden rounded-md">
                  <Image
                    src={data.profileImage.url || "/placeholder.svg"}
                    width={100}
                    height={100}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-gray-600 truncate max-w-full">{data.profileImage.name}</p>
              </div>
            ) : (
              <ArrowUpFromLine className="h-6 w-6 text-gray-400 mb-2" />
            )}

            <input
              ref={profileImageRef}
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "profileImage")}
              className="hidden"
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleProfileImageClick}
              className="mt-2"
              disabled={isUploadingProfile}
            >
              {data.profileImage?.url ? "Change Image" : "Upload Image"}
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Upload Logo</label>
          <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
            {isUploadingLogo ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-6 w-6 text-primary animate-spin mb-2" />
                <p className="text-sm text-gray-600">Uploading logo...</p>
              </div>
            ) : data.logo?.url ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-2 overflow-hidden rounded-md">
                  <Image
                    src={data.logo.url || "/placeholder.svg"}
                    alt="Logo preview"
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-gray-600 truncate max-w-full">{data.logo.name}</p>
              </div>
            ) : (
              <ArrowUpFromLine className="h-6 w-6 text-gray-400 mb-2" />
            )}

            <input
              ref={logoRef}
              type="file"
              name="logo"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "logo")}
              className="hidden"
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLogoClick}
              className="mt-2"
              disabled={isUploadingLogo}
            >
              {data.logo?.url ? "Change Logo" : "Upload Logo"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input type="email" name="email" value={data.email} onChange={handleChange} placeholder="Email" disabled={isEditMode} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <Input name="phone" value={data.phone} onChange={handleChange} placeholder="Phone" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Address (Manual)</label>
          <Input name="address" value={data.address} onChange={handleChange} placeholder="Address" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Service Radius (km)</label>
          <Input
            name="serviceRadius"
            type="number"
            min={0}
            value={data.serviceRadius}
            onChange={handleChange}
            placeholder="15"
          />
        </div>
      </div>

      {/* GOOGLE ADDRESS FIELD */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-2 flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          Google Address Lookup
        </label>

        <GoogleAddressAutocomplete
          onAddressSelect={handleGoogleAddressSelect}
          selectedAddress={
            data.googleAddress
              ? {
                id: data.googleAddress.placeId || "",
                address: data.googleAddress.fullAddress || "",
                placeId: data.googleAddress.placeId || "",
                reference: "",
                mainText: data.googleAddress.mainText || "",
                secondaryText: data.googleAddress.secondaryText || "",
                types: data.googleAddress.types || [],
                terms: [],
                matchedSubstrings: []
              }
              : null
          }
          placeholder="Search for your precise location using Google..."
          className="w-full"
        />
      </div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Password*</label>
          <Input name="password" id="password" value={password} type= {isEditMode ? "password" :"text"} onChange={handleChange} placeholder="********" disabled={isEditMode} />
          {
            !isPasswordValid && !isEditMode &&(
              <span className="text-red-500 text-sm mt-1 block">Password is not Valid</span>
            )
          }
        </div>
      </div>

      {/* Buttons are ALWAYS visible now */}
      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoTab;
