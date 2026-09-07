import dns from "dns";

dns.lookup(
  "01a06ce2-0cb2-7470-9596-9d419484da90.agent.localhost",
  (err, address) => {
    console.log(err);
    console.log(address);
  }
);