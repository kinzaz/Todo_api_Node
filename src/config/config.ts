import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

class Config {
  private static instance: Config;
  public readonly serverPort: number;

  private constructor() {
    this.serverPort = Number(process.env.SERVER_PORT) ?? 8080;
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
}

export default Config.getInstance();
