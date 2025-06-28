import googleLogo from '../assets/companyLogos/google.jpg';
import deshawLogo from '../assets/companyLogos/deshaw.jpg';
import amazonLogo from '../assets/companyLogos/amazon.jpg';
import metaLogo from '../assets/companyLogos/meta.jpg';
import flipkartLogo from '../assets/companyLogos/flipkart.jpg';
import zomatoLogo from '../assets/companyLogos/zomato.jpg';
import swiggyLogo from '../assets/companyLogos/swiggy.jpg';
import nvidiaLogo from '../assets/companyLogos/nvidia.jpg';
import ciscoLogo from '../assets/companyLogos/cisco.jpg';
import tcsLogo from '../assets/companyLogos/tcs.jpg';
import adobeLogo from '../assets/companyLogos/adobe.jpg';
import openaiLogo from '../assets/companyLogos/openai.jpg';
import paytmLogo from '../assets/companyLogos/paytm.jpg';
import microsoftLogo from '../assets/companyLogos/microsoft.jpg';
import polygonLogo from '../assets/companyLogos/polygon.jpg';
import oracleLogo from '../assets/companyLogos/oracle.jpg';
import infosysLogo from '../assets/companyLogos/infosys.jpg';
import zohoLogo from '../assets/companyLogos/zoho.jpg';
import airtelLogo from '../assets/companyLogos/airtel.jpg';
import ubisoftLogo from '../assets/companyLogos/ubisoft.jpg';

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Google",
    description: "Build modern UIs using React and TypeScript.",
    location: "Bangalore, India",
    type: "Full-Time",
    postedOn: "2025-06-10",
    logo: googleLogo,
    link: "https://careers.google.com/jobs"
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "D. E. Shaw",
    description: "Develop scalable APIs and services with Node.js.",
    location: "Hyderabad, India",
    type: "Full-Time",
    postedOn: "2025-06-12",
    logo: deshawLogo,
    link: "https://www.deshawindia.com/careers"
  },
  {
    id: 3,
    title: "Software Engineer",
    company: "Amazon",
    description: "Design cloud-native applications on AWS.",
    location: "Chennai, India",
    type: "Full-Time",
    postedOn: "2025-06-13",
    logo: amazonLogo,
    link: "https://www.amazon.jobs/"
  },
  {
    id: 4,
    title: "Research Intern - AI",
    company: "Meta",
    description: "Assist in AI/ML research projects and tools.",
    location: "Remote",
    type: "Internship",
    postedOn: "2025-06-09",
    logo: metaLogo,
    link: "https://www.metacareers.com/"
  },
  {
    id: 5,
    title: "Flutter Developer",
    company: "Flipkart",
    description: "Develop cross-platform mobile apps with Flutter.",
    location: "Pune, India",
    type: "Full-Time",
    postedOn: "2025-06-11",
    logo: flipkartLogo,
    link: "https://www.flipkartcareers.com/"
  },
  {
    id: 6,
    title: "UI/UX Designer",
    company: "Zomato",
    description: "Design clean and user-friendly interfaces.",
    location: "Gurgaon, India",
    type: "Part-Time",
    postedOn: "2025-06-14",
    logo: zomatoLogo,
    link: "https://www.zomato.com/careers"
  },
  {
    id: 7,
    title: "DevOps Engineer",
    company: "Swiggy",
    description: "Manage cloud infrastructure and CI/CD pipelines.",
    location: "Bangalore, India",
    type: "Full-Time",
    postedOn: "2025-06-10",
    logo: swiggyLogo,
    link: "https://careers.swiggy.com/"
  },
  {
    id: 8,
    title: "Machine Learning Engineer",
    company: "NVIDIA",
    description: "Build and deploy ML models at scale.",
    location: "Remote",
    type: "Full-Time",
    postedOn: "2025-06-08",
    logo: nvidiaLogo,
    link: "https://www.nvidia.com/en-in/about-nvidia/careers/"
  },
  {
    id: 9,
    title: "Cybersecurity Analyst",
    company: "Cisco",
    description: "Monitor security events and respond to incidents.",
    location: "Delhi, India",
    type: "Full-Time",
    postedOn: "2025-06-06",
    logo: ciscoLogo,
    link: "https://jobs.cisco.com/"
  },
  {
    id: 10,
    title: "Data Analyst",
    company: "TCS",
    description: "Analyze and visualize business data using SQL, Excel, and Power BI.",
    location: "Mumbai, India",
    type: "Full-Time",
    postedOn: "2025-06-05",
    logo: tcsLogo,
    link: "https://www.tcs.com/careers"
  },
  {
    id: 11,
    title: "Product Manager",
    company: "Adobe",
    description: "Define product vision and coordinate with cross-functional teams.",
    location: "Noida, India",
    type: "Full-Time",
    postedOn: "2025-06-04",
    logo: adobeLogo,
    link: "https://adobe.wd5.myworkdayjobs.com/en-US/adobeexternal"
  },
  {
    id: 12,
    title: "AI Research Intern",
    company: "OpenAI",
    description: "Contribute to cutting-edge language model research.",
    location: "Remote",
    type: "Internship",
    postedOn: "2025-06-03",
    logo: openaiLogo,
    link: "https://openai.com/careers"
  },
  {
    id: 13,
    title: "QA Engineer",
    company: "Paytm",
    description: "Test applications and ensure bug-free releases.",
    location: "Noida, India",
    type: "Full-Time",
    postedOn: "2025-06-02",
    logo: paytmLogo,
    link: "https://paytm.com/careers/"
  },
  {
    id: 14,
    title: "Cloud Engineer",
    company: "Microsoft",
    description: "Manage cloud resources and architecture on Azure.",
    location: "Hyderabad, India",
    type: "Full-Time",
    postedOn: "2025-06-01",
    logo: microsoftLogo,
    link: "https://careers.microsoft.com/"
  },
  {
    id: 15,
    title: "Blockchain Developer",
    company: "Polygon",
    description: "Develop and maintain smart contracts using Solidity.",
    location: "Remote",
    type: "Full-Time",
    postedOn: "2025-05-30",
    logo: polygonLogo,
    link: "https://polygon.technology/careers"
  },
  {
    id: 16,
    title: "Technical Writer",
    company: "Oracle",
    description: "Document software processes, APIs, and user guides.",
    location: "Bangalore, India",
    type: "Part-Time",
    postedOn: "2025-05-29",
    logo: oracleLogo,
    link: "https://www.oracle.com/in/corporate/careers/"
  },
  {
    id: 17,
    title: "Database Administrator",
    company: "Infosys",
    description: "Ensure database availability, security, and performance.",
    location: "Pune, India",
    type: "Full-Time",
    postedOn: "2025-05-28",
    logo: infosysLogo,
    link: "https://www.infosys.com/careers/"
  },
  {
    id: 18,
    title: "Full Stack Developer",
    company: "Zoho",
    description: "Build web applications using the MERN stack.",
    location: "Chennai, India",
    type: "Full-Time",
    postedOn: "2025-05-27",
    logo: zohoLogo,
    link: "https://www.zoho.com/careers/"
  },
  {
    id: 19,
    title: "Network Engineer",
    company: "Airtel",
    description: "Configure and maintain enterprise network systems.",
    location: "Delhi, India",
    type: "Full-Time",
    postedOn: "2025-05-26",
    logo: airtelLogo,
    link: "https://www.airtel.in/careers/"
  },
  {
    id: 20,
    title: "Game Developer",
    company: "Ubisoft",
    description: "Develop engaging gameplay using Unity and C#.",
    location: "Pune, India",
    type: "Full-Time",
    postedOn: "2025-05-25",
    logo: ubisoftLogo,
    link: "https://www.ubisoft.com/en-us/company/careers"
  }
];

export default jobs;
