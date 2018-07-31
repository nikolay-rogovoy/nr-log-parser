import {IStorage} from "./i-storage";
import {IFact} from "./i-fact";

/***/
export class ConsoleStorage implements IStorage {
    /***/
    write(fact: IFact) {
        console.log(JSON.stringify(fact));
    }
}