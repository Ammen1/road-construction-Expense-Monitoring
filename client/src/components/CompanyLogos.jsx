import { companyLogos } from "../constants";

const CompanyLogos = ({ className }) => {
  return (
    <div className={className}>
      <h5 className="mb-6 text-center tagline text-n-1/50">
        Helping Country By Biulding Beautiful Road
      </h5>
      <ul className="flex ">
        {companyLogos.map((logo, index) => (
          <li
            className="flex items-center justify-center flex-1 h-[8.5rem]"
            key={index}
          >
            <img src={logo} width={100} height={30} alt={logo} className="rounded-full" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyLogos;
