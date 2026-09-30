import fs from "node:fs";
import path from "node:path";

export interface PxxlDeploymentConfig {
  framework: string;
  region: string;
  environment: string;
  sslEnabled: boolean;
  edgeEndpoints: string[];
}

export interface PxxlRuntime {
  region: string;
  endpoint: string;
  /** "env" when PXXL_URL / PXXL_REGION are set on the host, "fixture" otherwise. */
  source: "env" | "fixture";
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

/** Where this process says it is deployed. The host's own settings win over the committed fixture. */
export function getPxxlRuntime(): PxxlRuntime {
  const config = loadPxxlConfig();
  const endpoint = process.env.PXXL_URL || process.env.DEPLOY_URL;
  const region = process.env.PXXL_REGION;
  if (endpoint && !/localhost|127\.0\.0\.1/.test(endpoint) && region) {
    return { region, endpoint, source: "env" };
  }
  return { region: config.region, endpoint: config.edgeEndpoints[0], source: "fixture" };
}
