import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";

/**
 * This class collects useful methods to interact with test data.
 * During tests, XML and MXL documents are preprocessed by karma,
 * and this is some helper code to retrieve them.
 */
export class TestUtils {
  public static getScore(name: string): Document {
    const path: string = "test/data/" + name;
    return (window as any).__xml__[path] as Document;
  }

  public static getMXL(scoreName: string): string {
    const path: string = "test/data/" + scoreName;
    return (window as any).__raw__[path] as string;
  }

  public static getDivElement(document: Document): HTMLElement {
    const div: HTMLElement = document.createElement("div");
    const body: HTMLElement = document.getElementsByTagName("body")[0];
    body.appendChild(div);
    return div;
  }

  /**
   * Retrieve from a XML document the first element with name "score-partwise"
   * @param doc is the XML Document
   * @returns {Element}
   */
  public static getPartWiseElement(doc: Document): Element | undefined {
    const nodes: NodeList = doc.childNodes;
    for (let i: number = 0, length: number = nodes.length; i < length; i += 1) {
      const node: Node = nodes[i];
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.nodeName.toLowerCase() === "score-partwise"
      ) {
        return node as Element;
      }
    }
    return undefined;
  }

  public static createOpenSheetMusicDisplay(
    div: HTMLElement,
  ): OpenSheetMusicDisplay {
    return new OpenSheetMusicDisplay(div, { autoResize: false });
  }

  // Test all the following xml files:
  public static XmlTestSet: string[] = [
    "ActorPreludeSample.xml",
    "Beethoven_AnDieFerneGeliebte.xml",
    "CharlesGounod_Meditation.xml",
    "Debussy_Mandoline.xml",
    "Dichterliebe01.xml",
    "JohannSebastianBach_Air.xml",
    "JohannSebastianBach_PraeludiumInCDur_BWV846_1.xml",
    "JosephHaydn_ConcertanteCello.xml",
    "Mozart_AnChloe.xml",
    "Mozart_DasVeilchen.xml",
    "MuzioClementi_SonatinaOpus36No1_Part1.xml",
    "MuzioClementi_SonatinaOpus36No1_Part2.xml",
    "MuzioClementi_SonatinaOpus36No3_Part1.xml",
    "MuzioClementi_SonatinaOpus36No3_Part2.xml",
    "Saltarello.xml",
    "ScottJoplin_EliteSyncopations.xml",
    "ScottJoplin_The_Entertainer.xml",
    "TelemannWV40.102_Sonate-Nr.1.1-Dolce.xml",
    "TelemannWV40.102_Sonate-Nr.1.2-Allegro-F-Dur.xml",
    //"VariousChordTests.musicxml", // doesn't exist anymore
  ];
}
