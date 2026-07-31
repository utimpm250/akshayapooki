"use client";

import React, { useState, useEffect } from 'react';
import { 
  Layers, Search, Plus, Edit2, Trash2, Globe, RefreshCw 
} from "lucide-react";

interface ServiceItem {
  id: string;
  serviceName: string;
  website: string;
  departmentFee: number;
  serviceCharge: number;
  commission: number;
  allowEdit: number;
  defaultWallet: string;
}

const INITIAL_SERVICES: ServiceItem[] = [
  { id: "1", serviceName: "Aadhaar 125", website: "", departmentFee: 0, serviceCharge: 125, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "2", serviceName: "Aadhaar 50", website: "", departmentFee: 0, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "3", serviceName: "Aadhaar 75", website: "", departmentFee: 0, serviceCharge: 75, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "4", serviceName: "Aadhaar online Demographic Update", website: "https://myaadhaar.uidai.gov.in/", departmentFee: 83, serviceCharge: 57, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "5", serviceName: "Aadhaar Online Document Update", website: "https://myaadhaar.uidai.gov.in/", departmentFee: 75, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "6", serviceName: "Aadhaar Printout", website: "", departmentFee: 0, serviceCharge: 20, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "7", serviceName: "Aadhaar PVC", website: "https://myaadhaar.uidai.gov.in/", departmentFee: 75, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "8", serviceName: "Agnipath/Agniveer", website: "", departmentFee: 0, serviceCharge: 100, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "9", serviceName: "Agristack Farmer Registration", website: "", departmentFee: 0, serviceCharge: 60, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "10", serviceName: "AIIMS-Agriculture", website: "", departmentFee: 0, serviceCharge: 100, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "11", serviceName: "All Bank Balance & Mini Statement", website: "", departmentFee: 0, serviceCharge: 30, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "12", serviceName: "AYUSHMAN CARD", website: "", departmentFee: 0, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "13", serviceName: "Bank Account Opening", website: "", departmentFee: 0, serviceCharge: 100, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "14", serviceName: "Birth Certificate", website: "", departmentFee: 0, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "15", serviceName: "Caste Certificate", website: "https://e-district.kerala.gov.in/", departmentFee: 30, serviceCharge: 40, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "16", serviceName: "Driving Licence Application", website: "https://parivahan.gov.in/", departmentFee: 200, serviceCharge: 100, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "17", serviceName: "Electricity Bill Payment", website: "https://kseb.in/", departmentFee: 0, serviceCharge: 20, commission: 2, allowEdit: 1, defaultWallet: "" },
  { id: "18", serviceName: "Income Certificate", website: "https://e-district.kerala.gov.in/", departmentFee: 30, serviceCharge: 40, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "19", serviceName: "PAN Card Application", website: "https://www.protean.in/", departmentFee: 107, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "20", serviceName: "Ration Card Services", website: "https://civilsupplieskerala.gov.in/", departmentFee: 0, serviceCharge: 60, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "21", serviceName: "Aadhaar Address Update", website: "https://myaadhaar.uidai.gov.in/", departmentFee: 50, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "22", serviceName: "Passport Application", website: "https://www.passportindia.gov.in/", departmentFee: 1500, serviceCharge: 200, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "23", serviceName: "Voter ID Registration", website: "https://voters.eci.gov.in/", departmentFee: 0, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "24", serviceName: "SSLC Book Copy", website: "", departmentFee: 100, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "25", serviceName: "Pancard Correction", website: "https://www.protean.in/", departmentFee: 107, serviceCharge: 60, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "26", serviceName: "Employment Exchange Registration", website: "", departmentFee: 0, serviceCharge: 40, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "27", serviceName: "Police Clearance Certificate", website: "", departmentFee: 250, serviceCharge: 100, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "28", serviceName: "Property Tax Payment", website: "", departmentFee: 0, serviceCharge: 30, commission: 2, allowEdit: 1, defaultWallet: "" },
  { id: "29", serviceName: "Water Bill Payment", website: "", departmentFee: 0, serviceCharge: 20, commission: 2, allowEdit: 1, defaultWallet: "" },
  { id: "30", serviceName: "Life Certificate (Jeevan Pramaan)", website: "", departmentFee: 0, serviceCharge: 40, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "31", serviceName: "Senior Citizen ID Card", website: "", departmentFee: 0, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "32", serviceName: "LLDC / Ownership Certificate", website: "https://e-district.kerala.gov.in/", departmentFee: 30, serviceCharge: 40, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "33", serviceName: "Non-Creamy Layer Certificate", website: "https://e-district.kerala.gov.in/", departmentFee: 30, serviceCharge: 40, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "34", serviceName: "Community Certificate", website: "https://e-district.kerala.gov.in/", departmentFee: 30, serviceCharge: 40, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "35", serviceName: "Nativity Certificate", website: "https://e-district.kerala.gov.in/", departmentFee: 30, serviceCharge: 40, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "36", serviceName: "Family Membership Certificate", website: "https://e-district.kerala.gov.in/", departmentFee: 30, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "37", serviceName: "Solvency Certificate", website: "https://e-district.kerala.gov.in/", departmentFee: 50, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "38", serviceName: "POSDC / Possession Certificate", website: "https://e-district.kerala.gov.in/", departmentFee: 30, serviceCharge: 40, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "39", serviceName: "Relationship Certificate", website: "https://e-district.kerala.gov.in/", departmentFee: 30, serviceCharge: 40, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "40", serviceName: "Inter-caste Marriage Certificate", website: "https://e-district.kerala.gov.in/", departmentFee: 30, serviceCharge: 40, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "41", serviceName: "Destitute Certificate", website: "https://e-district.kerala.gov.in/", departmentFee: 30, serviceCharge: 40, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "42", serviceName: "Aadhar Bio-metric Lock/Unlock", website: "https://myaadhaar.uidai.gov.in/", departmentFee: 0, serviceCharge: 30, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "43", serviceName: "Passport Seva Renewal", website: "https://www.passportindia.gov.in/", departmentFee: 1500, serviceCharge: 200, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "44", serviceName: "Voter ID Correction", website: "https://voters.eci.gov.in/", departmentFee: 0, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "45", serviceName: "Voter ID Address Shift", website: "https://voters.eci.gov.in/", departmentFee: 0, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "46", serviceName: "Ration Card New Member Addition", website: "https://civilsupplieskerala.gov.in/", departmentFee: 0, serviceCharge: 60, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "47", serviceName: "Ration Card Address Change", website: "https://civilsupplieskerala.gov.in/", departmentFee: 0, serviceCharge: 60, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "48", serviceName: "Ration Card Surrender Certificate", website: "https://civilsupplieskerala.gov.in/", departmentFee: 0, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "49", serviceName: "Udyam Registration (MSME)", website: "https://udyamregistration.gov.in/", departmentFee: 0, serviceCharge: 100, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "50", serviceName: "FSSAI Food License Registration", website: "https://foscos.fssai.gov.in/", departmentFee: 100, serviceCharge: 150, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "51", serviceName: "E-Shram Card Registration", website: "https://eshram.gov.in/", departmentFee: 0, serviceCharge: 40, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "52", serviceName: "PM Kisan Samman Nidhi Registration", website: "https://pmkisan.gov.in/", departmentFee: 0, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "53", serviceName: "K-FON Broadband Application", website: "", departmentFee: 0, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "54", serviceName: "Driving Licence Renewal", website: "https://parivahan.gov.in/", departmentFee: 200, serviceCharge: 100, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "55", serviceName: "Learners Licence Application", website: "https://parivahan.gov.in/", departmentFee: 150, serviceCharge: 100, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "56", serviceName: "International Driving Permit (IDP)", website: "https://parivahan.gov.in/", departmentFee: 1000, serviceCharge: 200, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "57", serviceName: "Vehicle Ownership Transfer", website: "https://parivahan.gov.in/", departmentFee: 300, serviceCharge: 150, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "58", serviceName: "Vehicle Fitness Certificate", website: "https://parivahan.gov.in/", departmentFee: 600, serviceCharge: 150, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "59", serviceName: "Property Mutation (Pokkuvaravu)", website: "https://elam.kerala.gov.in/", departmentFee: 50, serviceCharge: 100, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "60", serviceName: "Land Tax Payment Online", website: "https://www.revenue.kerala.gov.in/", departmentFee: 0, serviceCharge: 30, commission: 2, allowEdit: 1, defaultWallet: "" },
  { id: "61", serviceName: "Encumbrance Certificate (EC)", website: "https://pearl.registration.kerala.gov.in/", departmentFee: 50, serviceCharge: 60, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "62", serviceName: "Certified Copy of Deed", website: "https://pearl.registration.kerala.gov.in/", departmentFee: 100, serviceCharge: 80, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "63", serviceName: "Marriage Registration (Common)", website: "https://marriage.lsgkerala.gov.in/", departmentFee: 100, serviceCharge: 150, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "64", serviceName: "Marriage Registration (Hindu)", website: "https://reg.kerala.gov.in/", departmentFee: 100, serviceCharge: 150, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "65", serviceName: "Death Certificate", website: "", departmentFee: 0, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "66", serviceName: "Electricity New Connection", website: "https://kseb.in/", departmentFee: 500, serviceCharge: 200, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "67", serviceName: "Water New Connection", website: "", departmentFee: 500, serviceCharge: 200, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "68", serviceName: "LPG Subsidy Linking", website: "https://www.mylpg.in/", departmentFee: 0, serviceCharge: 30, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "69", serviceName: "NEET Exam Registration", website: "https://neet.nta.nic.in/", departmentFee: 1700, serviceCharge: 150, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "70", serviceName: "CUET Exam Registration", website: "https://cuet.samarth.ac.in/", departmentFee: 1000, serviceCharge: 150, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "71", serviceName: "KEAM Application", website: "https://cee.kerala.gov.in/", departmentFee: 900, serviceCharge: 150, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "72", serviceName: "PSC One Time Registration", website: "https://thulasi.psc.kerala.gov.in/", departmentFee: 0, serviceCharge: 100, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "73", serviceName: "PSC Exam Application", website: "https://thulasi.psc.kerala.gov.in/", departmentFee: 0, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "74", serviceName: "UPSC Civil Services Application", website: "https://upsconline.nic.in/", departmentFee: 100, serviceCharge: 200, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "75", serviceName: "SSC CGL / CHSL Application", website: "https://ssc.nic.in/", departmentFee: 100, serviceCharge: 150, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "76", serviceName: "RRB Railway Exam Application", website: "https://www.rrbcdg.gov.in/", departmentFee: 500, serviceCharge: 150, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "77", serviceName: "IBPS Banking Exam Application", website: "https://www.ibps.in/", departmentFee: 850, serviceCharge: 150, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "78", serviceName: "Scholarship Application (DCE)", website: "https://dcescholarship.kerala.gov.in/", departmentFee: 0, serviceCharge: 100, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "79", serviceName: "Scholarship Application (E-Grantz)", website: "https://egrantz.kerala.gov.in/", departmentFee: 0, serviceCharge: 100, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "80", serviceName: "National Scholarship Portal (NSP)", website: "https://scholarships.gov.in/", departmentFee: 0, serviceCharge: 100, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "81", serviceName: "Income Tax Return Filing (ITR-1)", website: "https://www.incometax.gov.in/", departmentFee: 0, serviceCharge: 500, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "82", serviceName: "Income Tax Return Filing (ITR-4)", website: "https://www.incometax.gov.in/", departmentFee: 0, serviceCharge: 800, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "83", serviceName: "GST Registration", website: "https://www.gst.gov.in/", departmentFee: 0, serviceCharge: 1000, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "84", serviceName: "GST Monthly Return Filing", website: "https://www.gst.gov.in/", departmentFee: 0, serviceCharge: 300, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "85", serviceName: "EPF Member Passbook Download", website: "https://www.epfindia.gov.in/", departmentFee: 0, serviceCharge: 30, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "86", serviceName: "EPF UAN Activation & KYC", website: "https://www.epfindia.gov.in/", departmentFee: 0, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "87", serviceName: "ESIC Portal Services", website: "https://www.esic.nic.in/", departmentFee: 0, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "88", serviceName: "Police Verification Report (PVR)", website: "", departmentFee: 250, serviceCharge: 100, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "89", serviceName: "Arms License Application", website: "", departmentFee: 1000, serviceCharge: 500, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "90", serviceName: "Fire NOC Application", website: "", departmentFee: 500, serviceCharge: 300, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "91", serviceName: "Food Safety Annual Return", website: "https://foscos.fssai.gov.in/", departmentFee: 100, serviceCharge: 200, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "92", serviceName: "Trade License Renewal", website: "", departmentFee: 200, serviceCharge: 150, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "93", serviceName: "Building Permit Application", website: "https://sanketham.lsgkerala.gov.in/", departmentFee: 1000, serviceCharge: 500, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "94", serviceName: "Ownership Transfer of Building", website: "", departmentFee: 200, serviceCharge: 150, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "95", serviceName: "Panchayat/Municipality Tax Assessment", website: "", departmentFee: 0, serviceCharge: 100, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "96", serviceName: "Professional Tax Payment", website: "", departmentFee: 0, serviceCharge: 50, commission: 2, allowEdit: 1, defaultWallet: "" },
  { id: "97", serviceName: "Veterinary Pet Registration", website: "", departmentFee: 50, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "98", serviceName: "Sub-Collector Court Case Status", website: "", departmentFee: 0, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "99", serviceName: "Legal Heir Certificate", website: "https://e-district.kerala.gov.in/", departmentFee: 50, serviceCharge: 100, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "100", serviceName: "Dependency Certificate", website: "https://e-district.kerala.gov.in/", departmentFee: 30, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "101", serviceName: "Possession & Non-Attachment Certificate", website: "https://e-district.kerala.gov.in/", departmentFee: 30, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "102", serviceName: "Silviculture / Tree Cutting Permit", website: "", departmentFee: 100, serviceCharge: 200, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "103", serviceName: "Fisheries ID Card Application", website: "", departmentFee: 0, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "104", serviceName: "Handloom Weavers ID Card", website: "", departmentFee: 0, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "105", serviceName: "Toddy Tappers Welfare Fund Services", website: "", departmentFee: 0, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "106", serviceName: "KSEB Solar Rooftop Subsidy Application", website: "https://www.pmsuryaghar.gov.in/", departmentFee: 0, serviceCharge: 200, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "107", serviceName: "AAY / PHH Ration Card Split", website: "https://civilsupplieskerala.gov.in/", departmentFee: 0, serviceCharge: 80, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "108", serviceName: "Ration Card Cancellation", website: "https://civilsupplieskerala.gov.in/", departmentFee: 0, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "109", serviceName: "Duplicate SSLC Certificate Apply", website: "", departmentFee: 200, serviceCharge: 100, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "110", serviceName: "Plus Two Certificate Verification", website: "", departmentFee: 150, serviceCharge: 100, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "111", serviceName: "University Degree Certificate Attestation", website: "", departmentFee: 500, serviceCharge: 200, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "112", serviceName: "MEA Attestation Online Processing", website: "https://www.mea.gov.in/", departmentFee: 500, serviceCharge: 300, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "113", serviceName: "Apostille Attestation Services", website: "", departmentFee: 1000, serviceCharge: 400, commission: 5, allowEdit: 1, defaultWallet: "BANK" },
  { id: "114", serviceName: "Railway Ticket Booking (IRCTC)", website: "https://www.irctc.co.in/", departmentFee: 0, serviceCharge: 50, commission: 10, allowEdit: 1, defaultWallet: "" },
  { id: "115", serviceName: "Flight Ticket Booking", website: "", departmentFee: 0, serviceCharge: 200, commission: 20, allowEdit: 1, defaultWallet: "" },
  { id: "116", serviceName: "Bus Ticket Booking (KSRTC/Private)", website: "", departmentFee: 0, serviceCharge: 30, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "117", serviceName: "Fastag Recharge Services", website: "", departmentFee: 0, serviceCharge: 20, commission: 2, allowEdit: 1, defaultWallet: "" },
  { id: "118", serviceName: "Mobile / DTH Recharge", website: "", departmentFee: 0, serviceCharge: 10, commission: 2, allowEdit: 1, defaultWallet: "" },
  { id: "119", serviceName: "PAN-Aadhaar Linking Check", website: "https://www.incometax.gov.in/", departmentFee: 0, serviceCharge: 30, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "120", serviceName: "NAD / ABC ID Creation (Academic Bank of Credits)", website: "https://www.abc.gov.in/", departmentFee: 0, serviceCharge: 50, commission: 5, allowEdit: 1, defaultWallet: "" },
  { id: "121", serviceName: "DigiLocker Account Creation & Document Fetch", website: "https://www.digilocker.gov.in/", departmentFee: 0, serviceCharge: 40, commission: 5, allowEdit: 1, defaultWallet: "" }
];

export default function ServiceManagementPage() {
  const [serviceList, setServiceList] = useState<ServiceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // New Service Form State
  const [newServiceName, setNewServiceName] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const [newDepartmentFee, setNewDepartmentFee] = useState(0);
  const [newServiceCharge, setNewServiceCharge] = useState(50);
  const [newCommission, setNewCommission] = useState(5);
  const [newDefaultWallet, setNewDefaultWallet] = useState('');

  // Edit Service Form State
  const [editServiceName, setEditServiceName] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editDepartmentFee, setEditDepartmentFee] = useState(0);
  const [editServiceCharge, setEditServiceCharge] = useState(0);
  const [editCommission, setEditCommission] = useState(0);
  const [editDefaultWallet, setEditDefaultWallet] = useState('');

  useEffect(() => {
    // Force reset storage key version to ensure 121 items load cleanly over old cache
    const storageVersionKey = 'smart_akshaya_services_v121_forced';
    const isLoaded = localStorage.getItem(storageVersionKey);

    if (!isLoaded) {
      localStorage.setItem('smart_akshaya_services', JSON.stringify(INITIAL_SERVICES));
      localStorage.setItem(storageVersionKey, 'true');
      setServiceList(INITIAL_SERVICES);
    } else {
      const saved = localStorage.getItem('smart_akshaya_services');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.length > 10) {
            setServiceList(parsed);
          } else {
            setServiceList(INITIAL_SERVICES);
            localStorage.setItem('smart_akshaya_services', JSON.stringify(INITIAL_SERVICES));
          }
        } catch (e) {
          setServiceList(INITIAL_SERVICES);
        }
      } else {
        setServiceList(INITIAL_SERVICES);
      }
    }
  }, []);

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const newServiceItem: ServiceItem = {
      id: Date.now().toString(),
      serviceName: newServiceName,
      website: newWebsite || '',
      departmentFee: Number(newDepartmentFee) || 0,
      serviceCharge: Number(newServiceCharge) || 0,
      commission: Number(newCommission) || 0,
      allowEdit: 1,
      defaultWallet: newDefaultWallet
    };

    const updatedList = [newServiceItem, ...serviceList];
    setServiceList(updatedList);
    localStorage.setItem('smart_akshaya_services', JSON.stringify(updatedList));

    setNewServiceName('');
    setNewWebsite('');
    setNewDepartmentFee(0);
    setNewServiceCharge(50);
    setNewCommission(5);
    setNewDefaultWallet('');
    setShowAddModal(false);
  };

  const handleOpenEdit = (service: ServiceItem) => {
    setSelectedService(service);
    setEditServiceName(service.serviceName);
    setEditWebsite(service.website);
    setEditDepartmentFee(service.departmentFee);
    setEditServiceCharge(service.serviceCharge);
    setEditCommission(service.commission);
    setEditDefaultWallet(service.defaultWallet || '');
    setShowEditModal(true);
  };

  const handleUpdateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    const updatedList = serviceList.map(s => {
      if (s.id === selectedService.id) {
        return {
          ...s,
          serviceName: editServiceName,
          website: editWebsite,
          departmentFee: Number(editDepartmentFee),
          serviceCharge: Number(editServiceCharge),
          commission: Number(editCommission),
          defaultWallet: editDefaultWallet
        };
      }
      return s;
    });

    setServiceList(updatedList);
    localStorage.setItem('smart_akshaya_services', JSON.stringify(updatedList));
    setShowEditModal(false);
    setSelectedService(null);
  };

  const handleDeleteService = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      const updatedList = serviceList.filter(s => s.id !== id);
      setServiceList(updatedList);
      localStorage.setItem('smart_akshaya_services', JSON.stringify(updatedList));
    }
  };

  const filteredServices = serviceList.filter(s => 
    s.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.defaultWallet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 relative min-h-screen pb-20">
      
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Service Management</h1>
      </div>

      {/* Top Gradient Banner Card */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-blue-100">Total Services</p>
          <h2 className="text-5xl font-black mt-1">{serviceList.length}</h2>
        </div>
        <div className="bg-white/15 backdrop-blur-md rounded-2xl px-5 py-3 flex items-center gap-3 border border-white/20">
          <Layers size={24} className="text-white" />
          <div>
            <p className="text-[10px] tracking-wider uppercase text-blue-100 font-bold">Active Records</p>
            <p className="text-sm font-black">{filteredServices.length} Records Found</p>
          </div>
        </div>
      </div>

      {/* Directory Header & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-800 text-base">Service List</h3>
          <button 
            onClick={() => {
              localStorage.removeItem('smart_akshaya_services_v121_forced');
              localStorage.removeItem('smart_akshaya_services');
              window.location.reload();
            }} 
            className="text-slate-400 hover:text-slate-600 transition flex items-center gap-1 text-xs bg-slate-100 px-2 py-1 rounded-lg"
            title="Force Reload All Services"
          >
            <RefreshCw size={12} /> Force Reset
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or wallet..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Service Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-4 px-6 font-bold">Service Name</th>
                <th className="py-4 px-6 font-bold">Default Wallet</th>
                <th className="py-4 px-6 font-bold">Dept Fee</th>
                <th className="py-4 px-6 font-bold">Srv Charge</th>
                <th className="py-4 px-6 font-bold">Commission</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 font-medium">
                    No services found.
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50/80 transition text-slate-700">
                    <td className="py-4 px-6 font-extrabold text-slate-900">
                      <span>{service.serviceName}</span>
                      {service.website && (
                        <a href={service.website} target="_blank" rel="noreferrer" className="block text-[10px] text-blue-600 hover:underline font-normal">
                          {service.website}
                        </a>
                      )}
                    </td>
                    <td className="py-4 px-6 font-bold text-blue-600">
                      {service.defaultWallet ? (
                        <span className="bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">{service.defaultWallet}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800">₹{service.departmentFee}</td>
                    <td className="py-4 px-6 font-bold text-slate-800">₹{service.serviceCharge}</td>
                    <td className="py-4 px-6 font-bold text-emerald-600">₹{service.commission}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button 
                        onClick={() => handleOpenEdit(service)}
                        className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition inline-flex items-center justify-center border border-slate-200"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteService(service.id)}
                        className="p-1.5 bg-slate-50 hover:bg-slate-100 text-rose-600 rounded-lg transition inline-flex items-center justify-center border border-slate-200"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition transform hover:scale-105 z-50"
        title="Add Service"
      >
        <Plus size={24} />
      </button>

      {/* Add New Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 text-base">Add New Service</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Service Name *</label>
                <input
                  type="text"
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 mt-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Default Wallet</label>
                  <input
                    type="text"
                    placeholder="e.g. BANK"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 mt-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    value={newDefaultWallet}
                    onChange={(e) => setNewDefaultWallet(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Website URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 mt-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    value={newWebsite}
                    onChange={(e) => setNewWebsite(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Dept. Fee</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 mt-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    value={newDepartmentFee}
                    onChange={(e) => setNewDepartmentFee(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Service Charge</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 mt-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    value={newServiceCharge}
                    onChange={(e) => setNewServiceCharge(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Commission</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 mt-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    value={newCommission}
                    onChange={(e) => setNewCommission(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md"
                >
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 text-base">Edit Service Details</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleUpdateService} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Service Name *</label>
                <input
                  type="text"
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 mt-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  value={editServiceName}
                  onChange={(e) => setEditServiceName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Default Wallet</label>
                  <input
                    type="text"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 mt-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    value={editDefaultWallet}
                    onChange={(e) => setEditDefaultWallet(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Website URL</label>
                  <input
                    type="text"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 mt-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    value={editWebsite}
                    onChange={(e) => setEditWebsite(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Dept. Fee</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 mt-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    value={editDepartmentFee}
                    onChange={(e) => setEditDepartmentFee(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Service Charge</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 mt-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    value={editServiceCharge}
                    onChange={(e) => setEditServiceCharge(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Commission</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 mt-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    value={editCommission}
                    onChange={(e) => setEditCommission(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}