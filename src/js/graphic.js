/* global d3 */
import isMobile from "./utils/is-mobile";

function resize() {}

function init() {
	if(isMobile.any()) {
		d3.select(".intro").style("padding-top", "4.5rem");
	}
}

export default { init, resize };
