"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, RefreshCw, Briefcase, ExternalLink, Bookmark, X } from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  wallet: string;
  deptFee: number;
  srvCharge: number;
  commission: number;
  followupDays?: number;
  portalUrl?: string;
  isPinned?: boolean;
}

// മുഴുവൻ 121 സർവീസുകളും ഉൾപ്പെടുത്തിയ ലിസ്റ്റ്
const initialServices: ServiceItem[] = [
  { id: "1", name: "Aadhaar 125", wallet: "CASH", deptFee: 0, srvCharge: 125, commission: 5, portalUrl: "" },
  { id: "2", name: "Aadhaar 50", wallet: "CASH", deptFee: 0, srvCharge: 50, commission: 5, portalUrl: "" },
  { id: "3", name: "Aadhaar 75", wallet: "CASH", deptFee: 0, srvCharge: 75, commission: 5, portalUrl: "" },
  { id: "4", name: "Aadhaar online Demographic Update", wallet: "BANK", deptFee: 83, srvCharge: 57, commission: 5, portalUrl: "https://myaadhaar.uidai.gov.in/", isPinned: true },
  { id: "5", name: "Aadhaar Online Document Update", wallet: "BANK", deptFee: 75, srvCharge: 50, commission: 5, portalUrl: "https://myaadhaar.uidai.gov.in/" },
  { id: "6", name: "Aadhaar Printout", wallet: "CASH", deptFee: 0, srvCharge: 20, commission: 5, portalUrl: "" },
  { id: "7", name: "Aadhaar PVC", wallet: "BANK", deptFee: 75, srvCharge: 50, commission: 5, portalUrl: "https://myaadhaar.uidai.gov.in/" },
  { id: "8", name: "Agnipath/Agniveer", wallet: "CASH", deptFee: 0, srvCharge: 100, commission: 5, portalUrl: "" },
  { id: "9", name: "Agristack Farmer Registration", wallet: "CASH", deptFee: 0, srvCharge: 60, commission: 5, portalUrl: "" },
  { id: "10", name: "AIIMS-Agriculture", wallet: "CASH", deptFee: 0, srvCharge: 100, commission: 5, portalUrl: "" },
  { id: "11", name: "All Bank Balance & Mini Statement", wallet: "CASH", deptFee: 0, srvCharge: 30, commission: 5, portalUrl: "" },
  { id: "12", name: "AYUSHMAN CARD", wallet: "CASH", deptFee: 0, srvCharge: 50, commission: 5, portalUrl: "" },
  { id: "13", name: "Bank Account Opening", wallet: "CASH", deptFee: 0, srvCharge: 100, commission: 5, portalUrl: "" },
  { id: "14", name: "Birth Certificate", wallet: "CASH", deptFee: 0, srvCharge: 50, commission: 5, portalUrl: "" },
  { id: "15", name: "Caste Certificate", wallet: "BANK", deptFee: 30, srvCharge: 40, commission: 5, portalUrl: "https://e-district.kerala.gov.in/" },
  { id: "16", name: "Driving Licence Application", wallet: "BANK", deptFee: 200, srvCharge: 100, commission: 5, portalUrl: "https://parivahan.gov.in/" },
  { id: "17", name: "Electricity Bill Payment", wallet: "CASH", deptFee: 0, srvCharge: 20, commission: 2, portalUrl: "https://kseb.in/" },
  { id: "18", name: "Income Certificate", wallet: "BANK", deptFee: 30, srvCharge: 40, commission: 5, portalUrl: "https://e-district.kerala.gov.in/" },
  { id: "19", name: "PAN Card Application", wallet: "BANK", deptFee: 107, srvCharge: 50, commission: 5, portalUrl: "https://www.protean.in/" },
  { id: "20", name: "Ration Card Services", wallet: "BANK", deptFee: 0, srvCharge: 60, commission: 5, portalUrl: "https://civilsupplieskerala.gov.in/" },
  { id: "21", name: "Aadhaar Address Update", wallet: "BANK", deptFee: 50, srvCharge: 50, commission: 5, portalUrl: "https://myaadhaar.uidai.gov.in/" },
  { id: "22", name: "Passport Application", wallet: "BANK", deptFee: 1500, srvCharge: 200, commission: 5, portalUrl: "https://www.passportindia.gov.in/" },
  { id: "23", name: "Voter ID Registration", wallet: "CASH", deptFee: 0, srvCharge: 50, commission: 5, portalUrl: "https://voters.eci.gov.in/" },
  { id: "24", name: "SSLC Book Copy", wallet: "BANK", deptFee: 100, srvCharge: 50, commission: 5, portalUrl: "" },
  { id: "25", name: "Pancard Correction", wallet: "BANK", deptFee: 107, srvCharge: 60, commission: 5, portalUrl: "https://www.protean.in/" },
  { id: "26", name: "Employment Exchange Registration", wallet: "CASH", deptFee: 0, srvCharge: 40, commission: 5, portalUrl: "" },
  { id: "27", name: "Police Clearance Certificate", wallet: "BANK", deptFee: 250, srvCharge: 100, commission: 5, portalUrl: "" },
  { id: "28", name: "Property Tax Payment", wallet: "CASH", deptFee: 0, srvCharge: 30, commission: 2, portalUrl: "" },
  { id: "29", name: "Water Bill Payment", wallet: "CASH", deptFee: 0, srvCharge: 20, commission: 2, portalUrl: "" },
  { id: "30", name: "Life Certificate (Jeevan Pramaan)", wallet: "CASH", deptFee: 0, srvCharge: 40, commission: 5, portalUrl: "" },
  { id: "31", name: "Senior Citizen ID Card", wallet: "CASH", deptFee: 0, srvCharge: 50, commission: 5, portalUrl: "" },
  { id: "32", name: "LLDC / Ownership Certificate", wallet: "BANK", deptFee: 30, srvCharge: 40, commission: 5, portalUrl: "https://e-district.kerala.gov.in/" },
  { id: "33", name: "Non-Creamy Layer Certificate", wallet: "BANK", deptFee: 30, srvCharge: 40, commission: 5, portalUrl: "https://e-district.kerala.gov.in/" },
  { id: "34", name: "Community Certificate", wallet: "BANK", deptFee: 30, srvCharge: 40, commission: 5, portalUrl: "https://e-district.kerala.gov.in/" },
  { id: "35", name: "Nativity Certificate", wallet: "BANK", deptFee: 30, srvCharge: 40, commission: 5, portalUrl: "https://e-district.kerala.gov.in/" },
  { id: "36", name: "Family Membership Certificate", wallet: "BANK", deptFee: 30, srvCharge: 50, commission: 5, portalUrl: "https://e-district.kerala.gov.in/" },
  { id: "37", name: "Solvency Certificate", wallet: "BANK", deptFee: 50, srvCharge: 50, commission: 5, portalUrl: "https://e-district.kerala.gov.in/" },
  { id: "38", name: "POSDC / Possession Certificate", wallet: "BANK", deptFee: 30, srvCharge: 40, commission: 5, portalUrl: "https://e-district.kerala.gov.in/" },
  { id: "39", name: "Relationship Certificate", wallet: "BANK", deptFee: 30, srvCharge: 40, commission: 5, portalUrl: "https://e-district.kerala.gov.in/" },
  { id: "40", name: "Inter-caste Marriage Certificate", wallet: "BANK", deptFee: 30, srvCharge: 40, commission: 5, portalUrl: "https://e-district.kerala.gov.in/" },
  { id: "41", name: "Destitute Certificate", wallet: "BANK", deptFee: 30, srvCharge: 40, commission: 5, portalUrl: "https://e-district.kerala.gov.in/" },
  { id: "42", name: "Aadhar Bio-metric Lock/Unlock", wallet: "CASH", deptFee: 0, srvCharge: 30, commission: 5, portalUrl: "https://myaadhaar.uidai.gov.in/" },
  { id: "43", name: "Passport Seva Renewal", wallet: "BANK", deptFee: 1500, srvCharge: 200, commission: 5, portalUrl: "https://www.passportindia.gov.in/" },
  { id: "44", name: "Voter ID Correction", wallet: "CASH", deptFee: 0, srvCharge: 50, commission: 5, portalUrl: "https://voters.eci.gov.in/" },
  { id: "45", name: "Voter ID Address Shift", wallet: "CASH", deptFee: 0, srvCharge: 50, commission: 5, portalUrl: "https://voters.eci.gov.in/" },
  { id: "46", name: "Ration Card New Member Addition", wallet: "BANK", deptFee: 0, srvCharge: 60, commission: 5, portalUrl: "https://civilsupplieskerala.gov.in/" },
  { id: "47", name: "Ration Card Address Change", wallet: "BANK", deptFee: 0, srvCharge: 60, commission: 5, portalUrl: "https://civilsupplieskerala.gov.in/" },
  { id: "48", name: "Ration Card Surrender Certificate", wallet: "BANK", deptFee: 0, srvCharge: 50, commission: 5, portalUrl: "https://civilsupplieskerala.gov.in/" },
  { id: "49", name: "Udyam Registration (MSME)", wallet: "CASH", deptFee: 0, srvCharge: 100, commission: 5, portalUrl: "https://udyamregistration.gov.in/" },
  { id: "50", name: "FSSAI Food License Registration", wallet: "BANK", deptFee: 100, srvCharge: 150, commission: 5, portalUrl: "https://foscos.fssai.gov.in/" },
  { id: "51", name: "E-Shram Card Registration", wallet: "CASH", deptFee: 0, srvCharge: 40, commission: 5, portalUrl: "https://eshram.gov.in/" },
  { id: "52", name: "PM Kisan Samman Nidhi Registration", wallet: "CASH", deptFee: 0, srvCharge: 50, commission: 5, portalUrl: "https://pmkisan.gov.in/" },
  { id: "53", name: "K-FON Broadband Application", wallet: "CASH", deptFee: 0, srvCharge: 50, commission: 5, portalUrl: "" },
  { id: "54", name: "Driving Licence Renewal", wallet: "BANK", deptFee: 200, srvCharge: 100, commission: 5, portalUrl: "https://parivahan.gov.in/" },
  { id: "55", name: "Learners Licence Application", wallet: "BANK", deptFee: 150, srvCharge: 100, commission: 5, portalUrl: "https://parivahan.gov.in/" },
  { id: "56", name: "International Driving Permit (IDP)", wallet: "BANK", deptFee: 1000, srvCharge: 200, commission: 5, portalUrl: "https://parivahan.gov.in/" },
  { id: "57", name: "Vehicle Ownership Transfer", wallet: "BANK", deptFee: 300, srvCharge: 150, commission: 5, portalUrl: "https://parivahan.gov.in/" },
  { id: "58", name: "Vehicle Fitness Certificate", wallet: "BANK", deptFee: 600, srvCharge: 150, commission: 5, portalUrl: "https://parivahan.gov.in/" },
  { id: "59", name: "Property Mutation (Pokkuvaravu)", wallet: "BANK", deptFee: 50, srvCharge: 100, commission: 5, portalUrl: "https://elam.kerala.gov.in/" },
  { id: "60", name: "Land Tax Payment Online", wallet: "CASH", deptFee: 0, srvCharge: 30, commission: 2, portalUrl: "https://www.revenue.kerala.gov.in/" },
  { id: "61", name: "Encumbrance Certificate (EC)", wallet: "BANK", deptFee: 50, srvCharge: 60, commission: 5, portalUrl: "https://pearl.registration.kerala.gov.in/" },
  { id: "62", name: "Certified Copy of Deed", wallet: "BANK", deptFee: 100, srvCharge: 80, commission: 5, portalUrl: "https://pearl.registration.kerala.gov.in/" },
  { id: "63", name: "Marriage Registration (Common)", wallet: "BANK", deptFee: 100, srvCharge: 150, commission: 5, portalUrl: "https://marriage.lsgkerala.gov.in/" },
  { id: "64", name: "Marriage Registration (Hindu)", wallet: "BANK", deptFee: 100, srvCharge: 150, commission: 5, portalUrl: "https://reg.kerala.gov.in/" },
  { id: "65", name: "Death Certificate", wallet: "CASH", deptFee: 0, srvCharge: 50, commission: 5, portalUrl: "" },
  { id: "66", name: "Electricity New Connection", wallet: "BANK", deptFee: 500, srvCharge: 200, commission: 5, portalUrl: "https://kseb.in/" },
  { id: "67", name: "Water New Connection", wallet: "BANK", deptFee: 500, srvCharge: 200, commission: 5, portalUrl: "" },
  { id: "68", name: "LPG Subsidy Linking", wallet: "CASH", deptFee: 0, srvCharge: 30, commission: 5, portalUrl: "https://www.mylpg.in/" },
  { id: "69", name: "NEET Exam Registration", wallet: "BANK", deptFee: 1700, srvCharge: 150, commission: 5, portalUrl: "https://neet.nta.nic.in/" },
  { id: "70", name: "CUET Exam Registration", wallet: "BANK", deptFee: 1000, srvCharge: 150, commission: 5, portalUrl: "https://cuet.samarth.ac.in/" },
  { id: "71", name: "KEAM Application", wallet: "BANK", deptFee: 900, srvCharge: 150, commission: 5, portalUrl: "https://cee.kerala.gov.in/" },
  { id: "72", name: "PSC One Time Registration", wallet: "CASH", deptFee: 0, srvCharge: 100, commission: 5, portalUrl: "https://thulasi.psc.kerala.gov.in/" },
  { id: "73", name: "PSC Exam Application", wallet: "CASH", deptFee: 0, srvCharge: 50, commission: 5, portalUrl: "https://thulasi.psc.kerala.gov.in/" },
  { id: "74", name: "UPSC Civil Services Application", wallet: "BANK", deptFee: 100, srvCharge: 200, commission: 5, portalUrl: "https://upsconline.nic.in/" },
  { id: "75", name: "SSC CGL / CHSL Application", wallet: "BANK", deptFee: 100, srvCharge: 150, commission: 5, portalUrl: "https://ssc.nic.in/" },
  { id: "76", name: "RRB Railway Exam Application", wallet: "BANK", deptFee: 500, srvCharge: 150, commission: 5, portalUrl: "https://www.rrbcdg.gov.in/" },
  { id: "77", name: "IBPS Banking Exam Application", wallet: "BANK", deptFee: 850, srvCharge: 150, commission: 5, portalUrl: "https://www.ibps.in/" },
  { id: "78", name: "Scholarship Application (DCE)", wallet: "CASH", deptFee: 0, srvCharge: 100, commission: 5, portalUrl: "https://dcescholarship.kerala.gov.in/" },
  { id: "79", name: "Scholarship Application (E-Grantz)", wallet: "CASH", deptFee: 0, srvCharge: 100, commission: 5, portalUrl: "https://egrantz.kerala.gov.in/" },
  { id: "80", name: "National Scholarship Portal (NSP)", wallet: "CASH", deptFee: 0, srvCharge: 100, commission: 5, portalUrl: "https://scholarships.gov.in/" },
  { id: "81", name: "Income Tax Return Filing (ITR-1)", wallet: "CASH", deptFee: 0, srvCharge: 500, commission: 5, portalUrl: "https://www.incometax.gov.in/" },
  { id: "82", name: "Income Tax Return Filing (ITR-4)", wallet: "CASH", deptFee: 0, srvCharge: 800, commission: 5, portalUrl: "https://www.incometax.gov.in/" },
  { id: "83", name: "GST Registration", wallet: "CASH", deptFee: 0, srvCharge: 1000, commission: 5, portalUrl: "https://www.gst.gov.in/" },
  { id: "84", name: "GST Monthly Return Filing", wallet: "CASH", deptFee: 0, srvCharge: 300, commission: 5, portalUrl: "https://www.gst.gov.in/" },
  { id: "85", name: "EPF Member Passbook Download", wallet: "CASH", deptFee: 0, srvCharge: 30, commission: 5, portalUrl: "https://www.epfindia.gov.in/" },
  { id: "86", name: "EPF UAN Activation & KYC", wallet: "CASH", deptFee: 0, srvCharge: 50, commission: 5, portalUrl: "https://www.epfindia.gov.in/" },
  { id: "87", name: "ESIC Portal Services", wallet: "CASH", deptFee: 0, srvCharge: 50, commission: 5, portalUrl: "https://www.esic.nic.in/" },
  { id: "88", name: "Police Verification Report (PVR)", wallet: "BANK", deptFee: 250, srvCharge: 100, commission: 5, portalUrl: "" },
  { id: "89", name: "Arms License Application", wallet: "BANK", deptFee: 1000, srvCharge: 500, commission: 5, portalUrl: "" },
  { id: "90", name: "Fire NOC Application", wallet: "BANK", deptFee: 500, srvCharge: 300, commission: 5, portalUrl: "" },
  { id: "91", name: "Food Safety Annual Return", wallet: "BANK", deptFee: 100, srvCharge: 200, commission: 5, portalUrl: "https://foscos.fssai.gov.in/" },
  { id: "92", name: "Trade License Renewal", wallet: "BANK", deptFee: 200, srvCharge: 150, commission: 5, portalUrl: "" },
  { id: "93", name: "Building Permit Application", wallet: "BANK", deptFee: 1000, srvCharge: 500, commission: 5, portalUrl: "https://sanketham.lsgkerala.gov.in/" },
  { id: "94", name: "Ownership Transfer of Building", wallet: "BANK", deptFee: 200, srvCharge: 150, commission: 5, portalUrl: "" },
  { id: "95", name: "Panchayat/Municipality Tax Assessment", wallet: "CASH", deptFee: 0, srvCharge: 100, commission: 5, portalUrl: "" },
  { id: "96", name: "Professional Tax Payment", wallet: "CASH", deptFee: 0, srvCharge: 50, commission: 2, portalUrl: "" },
  { id: "97", name: "Veterinary Pet Registration", wallet: "BANK", deptFee: 50, srvCharge: 50, commission: 5, portalUrl: "" },
  { id: "98", name: "Sub-Collector Court Case Status", wallet: "CASH", deptFee: 0, srvCharge: 50, commission: 5, portalUrl: "" },
  { id: "99", name: "Legal Heir Certificate", wallet: "BANK", deptFee: 50, srvCharge: 100, commission: 5, portalUrl: "https://e-district.kerala.gov.in/" },
  { id: "100", name: "Dependency Certificate", wallet: "BANK", deptFee: 30, srvCharge: 50, commission: 5, portalUrl: "https://e-district.kerala.gov.in/" },
  { id: "101", name: "Possession & Non-Attachment Certificate", wallet: "BANK", deptFee: 30, srvCharge: 50, commission: 5, portalUrl: "https://e-district.kerala.gov.in/" },
  { id: "102", name: "Silviculture / Tree Cutting Permit", wallet: "BANK", deptFee: 100, srvCharge: 200, commission: 5, portalUrl: "" },
  { id: "103", name: "Fisheries ID Card Application", wallet: "CASH", deptFee: 0, srvCharge: 50, commission: 5, portalUrl: "" },
  { id: "104", name: "Handloom Weavers ID Card", wallet: "CASH", deptFee: 0, srvCharge: 50, commission: 5, portalUrl: "" },
  { id: "105", name: "Toddy Tappers Welfare Fund Services", wallet: "CASH", deptFee: 0, srvCharge: 50, commission: 5, portalUrl: "" },
  { id: "106", name: "KSEB Solar Rooftop Subsidy Application", wallet: "CASH", deptFee: 0, srvCharge: 200, commission: 5, portalUrl: "https://www.pmsuryaghar.gov.in/" },
  { id: "107", name: "AAY / PHH Ration Card Split", wallet: "BANK", deptFee: 0, srvCharge: 80, commission: 5, portalUrl: "https://civilsupplieskerala.gov.in/" },
  { id: "108", name: "Ration Card Cancellation", wallet: "BANK", deptFee: 0, srvCharge: 50, commission: 5, portalUrl: "https://civilsupplieskerala.gov.in/" },
  { id: "109", name: "Duplicate SSLC Certificate Apply", wallet: "BANK", deptFee: 200, srvCharge: 100, commission: 5, portalUrl: "" },
  { id: "110", name: "Plus Two Certificate Verification", wallet: "BANK", deptFee: 150, srvCharge: 100, commission: 5, portalUrl: "" },
  { id: "111", name: "University Degree Certificate Attestation", wallet: "BANK", deptFee: 500, srvCharge: 200, commission: 5, portalUrl: "" },
  { id: "112", name: "MEA Attestation Online Processing", wallet: "BANK", deptFee: 500, srvCharge: 300, commission: 5, portalUrl: "https://www.mea.gov.in/" },
  { id: "113", name: "Apostille Attestation Services", wallet: "BANK", deptFee: 1000, srvCharge: 400, commission: 5, portalUrl: "" },
  { id: "114", name: "Railway Ticket Booking (IRCTC)", wallet: "CASH", deptFee: 0, srvCharge: 50, commission: 10, portalUrl: "https://www.irctc.co.in/" },
  { id: "115", name: "Flight Ticket Booking", wallet: "CASH", deptFee: 0, srvCharge: 200, commission: 20, portalUrl: "" },
  { id: "116", name: "Bus Ticket Booking (KSRTC/Private)", wallet: "CASH", deptFee: 0, srvCharge: 30, commission: 5, portalUrl: "" },
  { id: "117", name: "Fastag Recharge Services", wallet: "CASH", deptFee: 0, srvCharge: 20, commission: 2, portalUrl: "" },
  { id: "118", name: "Mobile / DTH Recharge", wallet: "CASH", deptFee: 0, srvCharge: 10, commission: 2, portalUrl: "" },
  { id: "119", name: "PAN-Aadhaar Linking Check", wallet: "CASH", deptFee: 0, srvCharge: 30, commission: 5, portalUrl: "https://www.incometax.gov.in/" },
  { id: "120", name: "NAD / ABC ID Creation (Academic Bank of Credits)", wallet: "CASH", deptFee: 0, srvCharge: 50, commission: 5, portalUrl: "https://www.abc.gov.in/" },
  { id: "121", name: "DigiLocker Account Creation & Document Fetch", wallet: "CASH", deptFee: 0, srvCharge: 40, commission: 5, portalUrl: "https://www.digilocker.gov.in/" }
];

export default function ServiceManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const [newName, setNewName] = useState('');
  const [newWallet, setNewWallet] = useState('CASH');
  const [newDeptFee, setNewDeptFee] = useState(0);
  const [newSrvCharge, setNewSrvCharge] = useState(0);
  const [newCommission, setNewCommission] = useState(0);
  const [newFollowupDays, setNewFollowupDays] = useState(0);
  const [newPortalUrl, setNewPortalUrl] = useState('');

  const walletOptions = ['CASH', 'BANK', 'Edistrict', 'CSC'];

  const fetchServices = () => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('managedServices');
      if (data) {
        setServices(JSON.parse(data));
      } else {
        localStorage.setItem('managedServices', JSON.stringify(initialServices));
      }
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchServices();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleSubmitService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) {
      alert("Please enter a service name!");
      return;
    }

    if (editingServiceId) {
      const updatedServices = services.map(service => {
        if (service.id === editingServiceId) {
          return {
            ...service,
            name: newName,
            wallet: newWallet,
            deptFee: Number(newDeptFee),
            srvCharge: Number(newSrvCharge),
            commission: Number(newCommission),
            followupDays: Number(newFollowupDays),
            portalUrl: newPortalUrl || undefined
          };
        }
        return service;
      });

      localStorage.setItem('managedServices', JSON.stringify(updatedServices));
      setServices(updatedServices);
    } else {
      const newService: ServiceItem = {
        id: Date.now().toString(),
        name: newName,
        wallet: newWallet,
        deptFee: Number(newDeptFee),
        srvCharge: Number(newSrvCharge),
        commission: Number(newCommission),
        followupDays: Number(newFollowupDays),
        portalUrl: newPortalUrl || undefined,
        isPinned: false
      };

      const updatedServices = [newService, ...services];
      localStorage.setItem('managedServices', JSON.stringify(updatedServices));
      setServices(updatedServices);
    }

    handleCloseModal();
  };

  const handleOpenAddModal = () => {
    setEditingServiceId(null);
    setNewName('');
    setNewWallet('CASH');
    setNewDeptFee(0);
    setNewSrvCharge(0);
    setNewCommission(0);
    setNewFollowupDays(0);
    setNewPortalUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setNewName(service.name);
    setNewWallet(service.wallet);
    setNewDeptFee(service.deptFee);
    setNewSrvCharge(service.srvCharge);
    setNewCommission(service.commission);
    setNewFollowupDays(service.followupDays || 0);
    setNewPortalUrl(service.portalUrl || '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingServiceId(null);
  };

  const handleTogglePin = (id: string) => {
    const updatedServices = services.map(service => {
      if (service.id === id) {
        const newPinState = !service.isPinned;
        return { ...service, isPinned: newPinState };
      }
      return service;
    });
    localStorage.setItem('managedServices', JSON.stringify(updatedServices));
    setServices(updatedServices);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      const updated = services.filter(s => s.id !== id);
      localStorage.setItem('managedServices', JSON.stringify(updated));
      setServices(updated);
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.wallet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 max-w-7xl w-full mx-auto relative">
      
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Service Management</h3>
        <button 
          onClick={handleRefresh}
          className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500"
        >
          <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Total Services Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-500 text-white rounded-2xl p-8 shadow-sm flex justify-between items-center relative overflow-hidden">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-200">Total Services</p>
          <h2 className="text-6xl font-black mt-1 tracking-tight">{filteredServices.length}</h2>
        </div>
        <div className="bg-white/15 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-4">
          <div className="p-2.5 bg-white/10 rounded-xl">
            <Briefcase size={22} className="text-white" />
          </div>
          <div>
            <p className="text-xl font-black tracking-tight">{filteredServices.length}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Records Found</p>
          </div>
        </div>
      </div>

      {/* Search & List Title */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-1.5 text-slate-700 font-bold text-base">
          <span>Service List</span>
          <button onClick={handleRefresh} className="text-slate-400 hover:text-slate-600">
            <RefreshCw size={14} />
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search by name or wallet..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-xs outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase bg-slate-50/50">
                <th className="py-4 px-6 w-1/3">Service Name</th>
                <th className="py-4 px-4">Default Wallet</th>
                <th className="py-4 px-4 text-center">Dept Fee</th>
                <th className="py-4 px-4 text-center">Srv Charge</th>
                <th className="py-4 px-4 text-center">Commission</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800">{service.name}</div>
                      {service.portalUrl && (
                        <a 
                          href={service.portalUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[10px] text-indigo-600 font-bold inline-flex items-center gap-0.5 mt-0.5 hover:underline"
                        >
                          Visit Portal <ExternalLink size={10} />
                        </a>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-wide ${
                        service.wallet === 'CASH' ? 'bg-slate-100 text-slate-600' :
                        service.wallet === 'BANK' ? 'bg-blue-50 text-blue-600' :
                        service.wallet === 'Edistrict' ? 'bg-purple-50 text-purple-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {service.wallet}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-slate-500">₹{service.deptFee}</td>
                    <td className="py-4 px-4 text-center text-slate-800 font-bold">₹{service.srvCharge}</td>
                    <td className="py-4 px-4 text-center text-emerald-600 font-bold">₹{service.commission}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleTogglePin(service.id)}
                          title={service.isPinned ? "Unpin from Dashboard" : "Pin to Dashboard"}
                          className={`p-1.5 rounded transition ${
                            service.isPinned 
                              ? 'bg-indigo-50 text-indigo-600' 
                              : 'hover:bg-slate-100 text-slate-400 hover:text-indigo-600'
                          }`}
                        >
                          <Bookmark size={14} fill={service.isPinned ? "currentColor" : "none"} />
                        </button>
                        <button 
                          onClick={() => handleOpenEditModal(service)}
                          title="Edit Service"
                          className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600 transition"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(service.id)}
                          title="Delete Service"
                          className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    No services found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Plus Button */}
      <button 
        onClick={handleOpenAddModal}
        className="fixed bottom-6 right-6 p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition transform active:scale-95 z-40"
      >
        <Plus size={24} />
      </button>

      {/* MODAL POPUP FOR ADD / EDIT SERVICE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-lg shadow-2xl overflow-hidden p-6 space-y-5">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-base">
                <Briefcase size={20} />
                <h4 className="font-bold text-slate-800 text-base">
                  {editingServiceId ? "Edit Service" : "Add New Service"}
                </h4>
              </div>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitService} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Service Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Passport Application"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Webpage URL (Optional)</label>
                <input 
                  type="url" 
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  value={newPortalUrl}
                  onChange={(e) => setNewPortalUrl(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Dept Fee (₹)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-center"
                    value={newDeptFee || ''}
                    onChange={(e) => setNewDeptFee(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Srv Charge (₹)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-center"
                    value={newSrvCharge || ''}
                    onChange={(e) => setNewSrvCharge(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Commission (₹)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-center"
                    value={newCommission || ''}
                    onChange={(e) => setNewCommission(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Default Wallet</label>
                  <select 
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-bold text-slate-700"
                    value={newWallet}
                    onChange={(e) => setNewWallet(e.target.value)}
                  >
                    {walletOptions.map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Followup Days</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-center"
                    value={newFollowupDays || 0}
                    onChange={(e) => setNewFollowupDays(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/20"
                >
                  {editingServiceId ? "Update Service" : "Add Service"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}