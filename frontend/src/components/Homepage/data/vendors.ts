import { VendorRole } from "@/types/vendorRole";

export const vendorRoles: VendorRole[] = [
  {
    id: "partner-transport",
    iconType: "keys",
    title: "Partner with us:\nTransportation Services",
    actionUrl: "/contact?type=transport",
  },
  {
    id: "partner-agency",
    iconType: "suitcase",
    title: "Partner with us:\nTravel agencies & Tour operators.",
    actionUrl: "/vendor/register",
  },
  {
    id: "partner-creator",
    iconType: "camera",
    title: "Become a TripDekho Creator: Travel, shoot videos, & inspire!.",
    actionUrl: "/contact?type=creator",
  },
  {
    id: "partner-captain",
    iconType: "headphones",
    title: "Become Our Trip\nCaptain",
    actionUrl: "/contact?type=captain",
  },
];

