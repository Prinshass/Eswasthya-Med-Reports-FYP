import React from "react";
import Head from "../components/Head";
import Biography from "../components/Biography";
const AboutUs = () => {
  return (
    <>
      <Head
        title={"Learn More About Us | ZeeCare Medical Institute"}
        imageUrl={"/about.png"}
      />
      <Biography imageUrl={"/whoweare.png"} />
    </>
  );
};

export default AboutUs;