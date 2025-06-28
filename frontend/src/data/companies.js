import googleLogo from '../assets/companyLogos/google.jpg';
import amazonLogo from '../assets/companyLogos/amazon.jpg';
import metaLogo from '../assets/companyLogos/meta.jpg';
import adobeLogo from '../assets/companyLogos/adobe.jpg';
import microsoftLogo from '../assets/companyLogos/microsoft.jpg';
import openaiLogo from '../assets/companyLogos/openai.jpg';
import flipkartLogo from '../assets/companyLogos/flipkart.jpg';
import swiggyLogo from '../assets/companyLogos/swiggy.jpg';
import zomatoLogo from '../assets/companyLogos/zomato.jpg';
import infosysLogo from '../assets/companyLogos/infosys.jpg';
import tcsLogo from '../assets/companyLogos/tcs.jpg';
import ibmLogo from '../assets/companyLogos/ibm.jpg';
import oracleLogo from '../assets/companyLogos/oracle.jpg';
import sapLogo from '../assets/companyLogos/sap.jpg';
import capgeminiLogo from '../assets/companyLogos/capgemini.jpg';
import cognizantLogo from '../assets/companyLogos/cognizant.jpg';
import accentureLogo from '../assets/companyLogos/accenture.jpg';
import paytmLogo from '../assets/companyLogos/paytm.jpg';
import byjusLogo from '../assets/companyLogos/byjus.png';
import phonepeLogo from '../assets/companyLogos/phonepe.jpg';
import airtelLogo from '../assets/companyLogos/airtel.jpg';
import relianceLogo from '../assets/companyLogos/reliance.jpg';
import zohoLogo from '../assets/companyLogos/zoho.jpg';
import polygonLogo from '../assets/companyLogos/polygon.jpg';
import upstoxLogo from '../assets/companyLogos/upstox.jpg';
import growwLogo from '../assets/companyLogos/groww.jpg';
import razorpayLogo from '../assets/companyLogos/razorpay.jpg';
import nvidiaLogo from '../assets/companyLogos/nvidia.jpg';
import samsungLogo from '../assets/companyLogos/samsung.jpg';
import dellLogo from '../assets/companyLogos/dell.jpg';

const companies = [
  {
    name: "Google",
    info: "Global leader in search engine, ads, and cloud technology.",
    link: "https://www.google.com/",
    logo: googleLogo,
  },
  {
    name: "Amazon",
    info: "E-commerce giant also offering AWS and digital streaming.",
    link: "https://www.amazon.com/",
    logo: amazonLogo,
  },
  {
    name: "Meta",
    info: "Building social platforms like Facebook, Instagram & VR.",
    link: "https://about.meta.com/",
    logo: metaLogo,
  },
  {
    name: "Adobe",
    info: "Design and creative software solutions like Photoshop, XD.",
    link: "https://www.adobe.com/",
    logo: adobeLogo,
  },
  {
    name: "Microsoft",
    info: "Enterprise software, Windows OS, and Azure cloud provider.",
    link: "https://www.microsoft.com/",
    logo: microsoftLogo,
  },
  {
    name: "OpenAI",
    info: "AI research and deployment lab behind ChatGPT.",
    link: "https://www.openai.com/",
    logo: openaiLogo,
  },
  {
    name: "Flipkart",
    info: "One of India’s largest e-commerce platforms.",
    link: "https://www.flipkart.com/",
    logo: flipkartLogo,
  },
  {
    name: "Swiggy",
    info: "Online food delivery and grocery platform.",
    link: "https://www.swiggy.com/",
    logo: swiggyLogo,
  },
  {
    name: "Zomato",
    info: "Food ordering and restaurant discovery app.",
    link: "https://www.zomato.com/",
    logo: zomatoLogo,
  },
  {
    name: "Infosys",
    info: "Global IT services and consulting company.",
    link: "https://www.infosys.com/",
    logo: infosysLogo,
  },
  {
    name: "TCS",
    info: "India’s largest IT services company.",
    link: "https://www.tcs.com/",
    logo: tcsLogo,
  },
  {
    name: "IBM",
    info: "Pioneer in computer systems, AI, and quantum computing.",
    link: "https://www.ibm.com/",
    logo: ibmLogo,
  },
  {
    name: "Oracle",
    info: "Enterprise software and cloud computing services.",
    link: "https://www.oracle.com/",
    logo: oracleLogo,
  },
  {
    name: "SAP",
    info: "Enterprise resource planning and business software.",
    link: "https://www.sap.com/",
    logo: sapLogo,
  },
  {
    name: "Capgemini",
    info: "Consulting, digital transformation, technology services.",
    link: "https://www.capgemini.com/",
    logo: capgeminiLogo,
  },
  {
    name: "Cognizant",
    info: "IT services and digital transformation solutions.",
    link: "https://www.cognizant.com/",
    logo: cognizantLogo,
  },
  {
    name: "Accenture",
    info: "Consulting and IT services company operating worldwide.",
    link: "https://www.accenture.com/",
    logo: accentureLogo,
  },
  {
    name: "Paytm",
    info: "Digital payments and financial services platform.",
    link: "https://www.paytm.com/",
    logo: paytmLogo,
  },
  {
    name: "BYJU'S",
    info: "India’s largest ed-tech company.",
    link: "https://byjus.com/",
    logo: byjusLogo,
  },
  {
    name: "PhonePe",
    info: "Mobile payments and financial services app.",
    link: "https://www.phonepe.com/",
    logo: phonepeLogo,
  },
  {
    name: "Airtel",
    info: "Telecom and digital TV services in India and abroad.",
    link: "https://www.airtel.in/",
    logo: airtelLogo,
  },
  {
    name: "Reliance",
    info: "Conglomerate in telecom, retail, and petrochemicals.",
    link: "https://www.ril.com/",
    logo: relianceLogo,
  },
  {
    name: "Zoho",
    info: "Productivity and business applications provider.",
    link: "https://www.zoho.com/",
    logo: zohoLogo,
  },
  {
    name: "Polygon",
    info: "Blockchain and Ethereum scaling solutions.",
    link: "https://polygon.technology/",
    logo: polygonLogo,
  },
  {
    name: "Upstox",
    info: "Stock trading and investment platform.",
    link: "https://upstox.com/",
    logo: upstoxLogo,
  },
  {
    name: "Groww",
    info: "Investment app for mutual funds, stocks, and more.",
    link: "https://groww.in/",
    logo: growwLogo,
  },
  {
    name: "Razorpay",
    info: "Online payments and banking services for businesses.",
    link: "https://razorpay.com/",
    logo: razorpayLogo,
  },
  {
    name: "NVIDIA",
    info: "Graphics cards, AI computing, and deep learning tech.",
    link: "https://www.nvidia.com/",
    logo: nvidiaLogo,
  },
  {
    name: "Samsung",
    info: "Consumer electronics, semiconductors, and displays.",
    link: "https://www.samsung.com/",
    logo: samsungLogo,
  },
  {
    name: "Dell",
    info: "Computers, servers, and enterprise tech solutions.",
    link: "https://www.dell.com/",
    logo: dellLogo,
  }
];

export default companies;
