import "./styles/main.css";
import { StorageService } from "./storage/StorageService";
import { Store } from "./store/Store";
import { UIRenderer } from "./ui/UIRenderer";
import { EventHandlers } from "./ui/EventHandlers";

const storage = new StorageService();
const store = new Store(storage);
const renderer = new UIRenderer(store);
new EventHandlers(store, renderer);

renderer.render(store.getState());
