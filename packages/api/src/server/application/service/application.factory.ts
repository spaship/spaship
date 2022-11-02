import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import * as FormData from "form-data";
import * as fs from "fs";
import * as path from "path";
import { Observable } from "rxjs";
import { LoggerService } from "src/configuration/logger/logger.service";
import { CreateApplicationDto, UpdateApplicationDto } from "src/server/application/application.dto";
import { Application } from "src/server/application/application.entity";
import { zip } from "zip-a-folder";

@Injectable()
/** @internal ApplicationFactoryService is for the business logics */
export class ApplicationFactoryService {
  constructor(private logger: LoggerService, private httpService: HttpService) { }

  async createTemplateAndZip(appPath: string, ref: string, name: string, tmpDir: string) {
    const fileExists = async (path) => !!(await fs.promises.stat(path).catch((e) => false));
    const rootspa = "ROOTSPA";
    if (appPath.charAt(0) == "/" && appPath.length === 1)
      appPath = rootspa;
    else if (appPath.charAt(0) == "/")
      appPath = appPath.substr(1);
    const spaShipFile = {
      websiteVersion: ref || "v1",
      websiteName: 'ecosystem-catalog',
      name,
      mapping: appPath,
      environments: [{ name: 'revamp', updateRestriction: false, exclude: false, ns: 'spaship--ecosystem-catalog' }],
    };
    this.logger.log("spaShipFile", JSON.stringify(spaShipFile));
    let zipPath;

    try {
      if (await fileExists(path.join(tmpDir, "dist"))) {
        await fs.writeFileSync(path.join(tmpDir, "dist/.spaship"), JSON.stringify(spaShipFile, null, "\t"));
        zipPath = path.join(tmpDir, `../SPAship${  Date.now()  }.zip`);
        await zip(path.join(tmpDir, "dist"), zipPath);
      } else if (await fileExists(path.join(tmpDir, "build"))) {
        await fs.writeFileSync(path.join(tmpDir, "build/.spaship"), JSON.stringify(spaShipFile, null, "\t"));
        zipPath = path.join(tmpDir, `../SPAship${  Date.now()  }.zip`);
        await zip(path.join(tmpDir, "build"), zipPath);
      } else {
        await fs.writeFileSync(path.join(tmpDir, ".spaship"), JSON.stringify(spaShipFile, null, "\t"));
        zipPath = path.join(tmpDir, `../SPAship${  Date.now()  }.zip`);
        await zip(tmpDir, zipPath);
      }
      this.logger.log("zippath", zipPath);
    } catch (err) {
      this.logger.error("SPA", "Invalid SPA Path in request body.");
      throw new Error("Invalid SPA Path in request body.");
    }
    return zipPath;
  }

  deploymentRequest(formData: FormData): Promise<AxiosResponse<any, any>> {
    return this.httpService.axiosRef.post('https://operator-route.apps.int.mpp.preprod.iad2.dc.paas.redhat.com/api/upload', formData,
      {
        maxBodyLength: Infinity,
        headers: formData.getHeaders(),
      }
    )
  }

  createNewApplication(createApplicationDto: CreateApplicationDto): Application {
    const newApplication = new Application();
    newApplication.spaName = createApplicationDto.name;
    newApplication.path = createApplicationDto.path;
    return newApplication;
  }

  updateApplication(updateApplicationDto: UpdateApplicationDto) {
    const newApplication = new Application();
    return newApplication;
  }

}
