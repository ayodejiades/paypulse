import fs from "node:fs";
import path from "node:path";

export interface PxxlDeploymentConfig {
  framework: string;
  region: string;
  environment: string;
  sslEnabled: boolean;
  edgeEndpoints: string[];
}

export function loadPxxlConfig(): PxxlDeploymentConfig {
  const fixturePath = path.join(process.cwd(), "fixtures", "sponsors", "pxxl.json");
  if (fs.existsSync(fixturePath)) {
    const data = JSON.parse(fs.readFileSync(fixturePath, "utf-8"));
    return {
      framework: data.framework,
      region: data.region,
      environment: data.environment,
      sslEnabled: data.sslEnabled,
      edgeEndpoints: data.edgeEndpoints,
    };
  }
  return {
    framework: "nextjs",
    region: "africa-west-lagos",
    environment: "production",
    sslEnabled: true,
    edgeEndpoints: ["https://paypulse.pxxl.app"],
  };
}
