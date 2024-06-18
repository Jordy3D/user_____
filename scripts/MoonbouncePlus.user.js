// ==UserScript==
// @name         Moonbounce Plus
// @namespace    Bane
// @version      0.3.0
// @description  A few handy tools for Moonbounce
// @author       Bane
// @match        https://moonbounce.gg/u/@me/backpack
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moonbounce.gg
// @grant        none
// ==/UserScript==

// ==Changelog==
//
// 0.1.0    - Initial release
//              - Stores some items and recipes (woefully incomplete)
//              - Adds an event listener to item images that copies the item's UUID to the clipboard
// 0.2.0    - Added the ability to copy the item's name and ID along with the UUID (ctrl + click)
// 0.2.1    - Better formatting for copied item info
// 0.3.0    - Deprecated the ability to copy just the item's UUID
//              - Replaced with a full item info copy
//
// ==/Changelog==

// ==TODO==
//
// - Add more items and recipes
// - Add more classes to find elements on the page
// - Add buttons to go to the Marketplace and Backpack on the Moonbounce Portal (whenever it's active on a page)
// - Move the data to separate files
// - Add a notification when an item is copied to the clipboard
// - Add a notification when the item info is copied to the clipboard
// - Add a notification when a recipe is able to be crafted
//
// ==/TODO==


// ██████╗  █████╗ ████████╗ █████╗ 
// ██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗
// ██║  ██║███████║   ██║   ███████║
// ██║  ██║██╔══██║   ██║   ██╔══██║
// ██████╔╝██║  ██║   ██║   ██║  ██║
// ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝

// Example item image URLs:
// https://moonbounce.gg/images/fp/3cac0a5d-fa79-4998-b1a7-3ed2ef1ee2d8/c/f/preview.png
// https://moonbounce.gg/images/fp/4b51f64d-a5e1-4fba-8713-f15414306330/c/f/preview.png
// We only care about the item ID, which is the UUID in the URL, and the item will be stored alongside it

/**
 * Items that can be found in the game
 * Properties:
 * id: the item's ID
 * name: the item's name
 * uuid: the item's UUID
 */
const items = [
    { id: 1, name: "Rollo", uuid: "87cf3dd1-6b46-41d7-988f-68d15c046d2e", description: "The wise all-seeing eye of Moonbounce.", rarity: "COMMON", type: "CHARACTER", sources: [] },
    { id: 5, name: "Devo", uuid: "ed88dee8-352c-488d-8e44-d8ac5c90daa3", description: "The friendliest demon from the deep dark circles of Moonbounce.", rarity: "COMMON", type: "CHARACTER", sources: [] },
    { id: 8, name: "Empty Bottle", uuid: "ff73877e-7e36-45be-8f6a-cbedfee59ed2", description: "An empty bottle. Looks boring right now,  but soon you’ll be able to use it to craft potions,  dyes,  and more!", rarity: "COMMON", type: "MATERIAL", sources: ["Assorted Goodie Bag"] },
    { id: 10, name: "Two Blue Coins", uuid: "c912f2bb-c7ab-460a-8fa9-2697be86eb69", description: "This looks an awful lot like two gold coins,  but it may be worth a lot more or maybe even less later on.", rarity: "COMMON", type: "MATERIAL", sources: ["Assorted Goodie Bag"] },
    { id: 11, name: "Two Gold Coins", uuid: "34857a5c-bebb-41ca-8585-4cbba2ed6402", description: "Well it’s not a lot,  but hey at least it’s something!", rarity: "COMMON", type: "MATERIAL", sources: ["Assorted Goodie Bag"] },
    { id: 12, name: "White Fabric", uuid: "5c76c8d1-d616-493d-9b1d-5ad9d3cefec6", description: "Now all you need to find is some sewing tools and you’ll be on your way to crafting the next hottest pixel fit on the internet!", rarity: "COMMON", type: "MATERIAL", sources: ["Assorted Goodie Bag"] },
    { id: 13, name: "Wizard Hat", uuid: "d4e78f9a-4d25-4ee5-9456-ee0b85d27ab6", description: "An ancient relic of a long-forgotten sorcery art. It will not give you magical abilities,  but it will give you the ability to look like you have some.", rarity: "RARE", type: "ACCESSORY", sources: [] },
    { id: 34, name: "Smooth Silk", uuid: "a906cd5a-5cdb-4e4a-a817-ad7f2afd6fb6", description: "I guess this comes from a silkworm?", rarity: "UNCOMMON", type: "MATERIAL", sources: [] },
    { id: 67, name: "Uncut Nebula", uuid: "8d44e793-f6e7-4bf1-a93c-f75336e0c853", description: "We think this could look really cool,  but its too early to tell", rarity: "COMMON", type: "MATERIAL", sources: ["Rock Collection"] },
    { id: 69, name: "Crumpled Metal", uuid: "16b51533-eae6-445c-9ba1-636a7fe92f19", description: "Something smashed this thing to pieces!", rarity: "COMMON", type: "MATERIAL", sources: ["Framed Chest"] },
    { id: 70, name: "Green Gem", uuid: "1ec6e686-3364-4fd2-adef-8cb52d5a598b", description: "Green like the grass you don’t touch.", rarity: "COMMON", type: "MATERIAL", sources: ["Rock Collection"] },
    { id: 71, name: "Slightly Magical Fruit", uuid: "7e9361a5-1e65-4a1d-97a6-e2da33b8c710", description: "Enjoy it when you're feeling like a wizard who's having an off day.", rarity: "COMMON", type: "MATERIAL", sources: ["Assorted Goodie Bag"] },    
    { id: 72, name: "Minor Magic Potion", uuid: "15a7f336-363d-4e31-b8f7-2fa262ad9437", description: "You can kinda feel something special about this potion,  but its not much.", rarity: "UNCOMMON", type: "MATERIAL", sources: [] },
    { id: 73, name: "Stardust", uuid: "ce6b510e-d990-4111-8c7f-5e60fbd0baeb", description: "It fell right out of the sky!", rarity: "COMMON", type: "MATERIAL", sources: ["Soup's Goodies"] },
    { id: 74, name: "Starlight Alloy", uuid: "50c3b50c-d265-4093-abdd-a104afad116d", description: "We've brewed this bad boy with stardust,  moonbeams,  and a dash of pure \"because we can.”", rarity: "UNCOMMON", type: "MATERIAL", sources: [] },
    { id: 101, name: "Plain Milk Carton", uuid: "2c1f7554-9dea-4a06-a891-f3adb133759f", description: "Your dependable,  uneventful companion in the multiplayer internet,  because sometimes,  life needs a little less excitement.", rarity: "COMMON", type: "MATERIAL", sources: ["Assorted Goodie Bag"] },
    { id: 177, name: "Haunted Bone", uuid: "2697226d-adea-498f-947a-46c95d21abe6", description: "When this ghostly relic makes its way into your cauldron,  it brings a certain spooky je ne sais quoi to the mix.", rarity: "COMMON", type: "MATERIAL", sources: ["Normal Candy Basket", "Disco Mats", "Framed Chest"] },
    { id: 178, name: "Witch's Cauldron", uuid: "a13a4787-bd63-43af-9385-00f326205792", description: "Dive into the world of alchemy with a cauldron that can't resist a good stir.", rarity: "COMMON", type: "TOOL", sources: ["Framed Chest"] },
    { id: 181, name: "Old Thread", uuid: "6d4cfef0-cbf6-432f-901e-445771be2a0b" },
    { id: 235, name: "Purple Gem", uuid: "d1e142fa-3ede-4960-817b-3bc4e7a5f72a", description: "A dark aura seems to surround this gem", rarity: "COMMON", type: "MATERIAL", sources: ["Rock Collection"] },
    { id: 265, name: "Gold Bow", uuid: "b32ef097-3f7c-411c-997b-35395f3b361e", description: "Like the color of the sunrise,  so cute!", rarity: "UNCOMMON", type: "ACCESSORY", sources: ["Red Loot Bag"] },
    { id: 266, name: "Pink Bow", uuid: "de2b7419-800c-4f2d-832f-272786e9aaea", description: "Look at it! How precious!", rarity: "UNCOMMON", type: "ACCESSORY", sources: ["Red Loot Bag"] },
    { id: 267, name: "Purple Top Hat", uuid: "0f0916d3-df3c-4bc6-aa93-addbe299eee1", description: "*tips hat* “good day”", rarity: "RARE", type: "ACCESSORY", sources: ["Red Loot Bag"] },
    { id: 268, name: "Green Top Hat", uuid: "67395eab-dc0b-4b16-a584-0b12540b9416", description: "I think a leprechaun misplaced something…", rarity: "RARE", type: "ACCESSORY", sources: ["Red Loot Bag"] },
    { id: 298, name: "Polished Red Gem", uuid: "fcbdf0b3-81e9-44ed-b573-8ccb904c3777", description: "A red gem cut into a near perfect circle. Shiny!", rarity: "UNCOMMON", type: "MATERIAL", sources: ["Rock Collection", "Soup's Goodies"] },
    { id: 299, name: "Polished Blue Gem", uuid: "4a98c33e-d620-43da-9914-85b0450010f5", description: "A blue gem cut into a near perfect circle. Shiny!", rarity: "RARE", type: "MATERIAL", sources: ["Rock Collection", "Potion Supplies"] },
    { id: 300, name: "Hammer", uuid: "e22fb197-a8ae-4d99-8efb-e7ab43034779", description: "*clink* *clink* *CLUNK*", rarity: "COMMON", type: "TOOL", sources: ["Potion Supplies", "Alien Food Pouch", "Framed Chest"] },
    { id: 366, name: "Fairy Particles", uuid: "5fd879b3-6e88-4328-998d-2992d8f5b119", description: "Rumor has it that this pinch of sparkly dust originates from an enchanted etherworld. Or they could just be glitter flakes that got loose from the unicorn craze back in the 2010s.", rarity: "RARE", type: "TOOL", sources: ["Box of Cheer", "Alien Food Pouch", "Framed Chest"] },
    { id: 378, name: "Branch", uuid: "6a32eaa4-4841-4f1e-9fec-7b771fd1720b", description: "Talk about a weird wood wide web! Just remember - the developers who planted this seed aren’t liable for any forests spontaneously generated…", rarity: "COMMON", type: "MATERIAL", sources: ["Assorted Goodie Bag", "Alien Food Pouch"] },
    { id: 380, name: "Tiny Crown", uuid: "1b63885f-8581-4c29-942e-ae063314bab1", description: "For when you're feeling royally adorable – a crown fit for a mini monarch.", rarity: "UNCOMMON", type: "ACCESSORY", sources: ["Style Crate #1"] },
    { id: 381, name: "Crown", uuid: "fd6b7659-a352-49f4-be05-6cb2cf7755e1", description: "Rule the virtual kingdom in regal splendor with this majestic crown.", rarity: "RARE", type: "ACCESSORY", sources: [] },
    { id: 382, name: "Tiny Tiara", uuid: "1198078f-d182-4367-966b-281942dd4fcf", description: "A petite tiara for the big moments – because even tiny celebrations deserve a touch of sparkle.", rarity: "UNCOMMON", type: "ACCESSORY", sources: ["Style Crate #1"] },
    { id: 383, name: "Purple Party Hat", uuid: "d7a4f5a3-0503-4473-9a6c-1b2b831975cb", description: "Purple reigns supreme in the party kingdom – your ticket to a regal celebration!", rarity: "UNCOMMON", type: "ACCESSORY", sources: ["Style Crate #1"] },
    { id: 384, name: "Blue Party Hat", uuid: "4b51f64d-a5e1-4fba-8713-f15414306330", description: "Dive into the blue wave of celebration – this hat is your passport to a party paradise.", rarity: "UNCOMMON", type: "ACCESSORY", sources: ["Style Crate #1"] },
    { id: 385, name: "Red Party Hat", uuid: "b4441ec5-b9f2-4c40-b63d-9829e97d020f", description: "Paint the town red with this festive party hat – because every celebration needs a bold hue.", rarity: "UNCOMMON", type: "ACCESSORY", sources: ["Style Crate #1", "Soup's Goodies"] },
    { id: 386, name: "Elite Party Hat", uuid: "12ec3f9a-ae0c-4c21-a146-051586cc0a3c", description: "For the party elite – this hat guarantees VIP status at every celebration.", rarity: "RARE", type: "ACCESSORY", sources: [] },
    { id: 387, name: "Star Hat", uuid: "ebb9fe8d-76f6-4fb4-8a74-de3455e05939", description: "Wear the galaxy on your head – because every star deserves a moment in the spotlight.", rarity: "UNCOMMON", type: "ACCESSORY", sources: ["Style Crate #1"] },
    { id: 389, name: "Halo Hat", uuid: "48b7be77-9d94-451b-ae0c-5ebd421cae14", description: "When a halo meets a hoop – a hat that's as heavenly as it is trendy.", rarity: "RARE", type: "ACCESSORY", sources: ["Blue Loot Crate"] },
    { id: 390, name: "Bowler Hat", uuid: "7705507b-2bb3-4bc7-92d8-db6113e77334", description: "a timeless accessory for every celebration,  big or small!", rarity: "UNCOMMON", type: "ACCESSORY", sources: ["Blue Loot Crate"] },
    { id: 391, name: "Antenna Hat", uuid: "3cac0a5d-fa79-4998-b1a7-3ed2ef1ee2d8", description: "Keep your connection strong to the good times with this antennae-topped hat – a signal that the party is always on!", rarity: "UNCOMMON", type: "ACCESSORY", sources: ["Blue Loot Crate"] },
    { id: 392, name: "Flying Saucer", uuid: "c7e5df51-ac0a-432a-9308-f52a7f7e2f69", description: "Embark on a whimsical journey with this UFO hat – ready to lift your spirits to new heights of fun and imagination!", rarity: "RARE", type: "ACCESSORY", sources: ["Blue Loot Crate"] },
    { id: 393, name: "Minicorn Horn", uuid: "9ce5592f-581d-49bc-8ffa-242a0f3b3d7d", description: "Unleash your inner magic with this enchanting minicorn horn – every day is an opportunity for fantastical moments!", rarity: "UNCOMMON", type: "ACCESSORY", sources: ["Blue Loot Crate"] },
    { id: 398, name: "Yin Yang", uuid: "325fb98b-5556-4fc2-b680-4ac7d167c0f0", description: "It's all about balance,  and that's just a part of life!", rarity: "UNCOMMON", type: "MATERIAL", sources: ["Cookie Crate", "Red Loot Bag"] },
    { id: 409, name: "Anatomical Heart", uuid: "2aa56c3f-5e74-4cc5-80bb-62670557a1ea", description: "When we said you steal everyone's hearts away,  we didn't mean it literally", rarity: "RARE", type: "MATERIAL", sources: ["Red Loot Bag", "Heart Box"] },    { id: 419, name: "Sprout Trucker", uuid: "071c5a02-4ee3-40e4-9ed9-54e3255f1dd8" },
    { id: 428, name: "Bonnet Sprout", uuid: "3a9aff43-e766-40ff-8303-10d32c963a80", description: "Rock the Bonnet Sprout and watch your character's style game blossom!", rarity: "COMMON", type: "ACCESSORY", sources: ["Spring Leaves"] },
    { id: 433, name: "Fertilizer", uuid: "8fee4718-c424-4832-a7dc-afd5583d5165", description: "The secret sauce for pixel plant success", rarity: "COMMON", type: "MATERIAL", sources: ["Spring Leaves"] },
    { id: 434, name: "Garden Pot", uuid: "e53757b7-7d32-48ff-a7ee-51bb128184ea", description: "Say hello to your virtual green thumb's best friend.", rarity: "COMMON", type: "MATERIAL", sources: ["Spring Leaves"] },
    { id: 436, name: "Watering Can", uuid: "462a4c10-f11e-4f61-8a82-755264845a4b", description: "The low-key MVP of the gardening world,  helping you keep those pixel plants thriving with minimal effort.", rarity: "COMMON", type: "TOOL", sources: ["Spring Leaves"] },
    { id: 437, name: "Iron Plate", uuid: "b022b2a1-f957-4bb6-8f17-cbfe679ffeaf", description: "Add a touch of industrial chic to your virtual creations,  turning pixels into powerhouse designs.", rarity: "UNCOMMON", type: "MATERIAL", sources: ["Potion Supplies", "Alien Food Pouch", "Framed Chest", "Soup's Goodies"] },
    { id: 438, name: "Vinyl Sheet", uuid: "6a5c447b-e6f5-4a0f-9713-24e290e31d6a", description: "Just your average vinyl material,  nothing to write home about.", rarity: "COMMON", type: "MATERIAL", sources: ["Dusty Box"] },
    { id: 439, name: "Prismatic Dust", uuid: "e2d09ade-42e8-4787-9a81-b3f25be68f36", description: "Infuse your pixel projects with rainbow magic,  turning dull into dazzling.", rarity: "RARE", type: "MATERIAL", sources: ["Dusty Box", "Potion Supplies", "Soup's Goodies"] },
    { id: 440, name: "Red Lens", uuid: "332b0733-4cd2-4998-ae29-9eeae9d53e49", description: "View the virtual world through rose-tinted pixels", rarity: "UNCOMMON", type: "MATERIAL", sources: ["Disco Mats"] },
    { id: 442, name: "Gold Orb", uuid: "67ed7dfb-c142-4d61-9da0-036f23150ff1", description: "You Just struck pixel gold,  turning your pixel dreams into reality", rarity: "UNCOMMON", type: "MATERIAL", sources: ["Dusty Box", "Framed Chest"] },
    { id: 443, name: "Strange Cloth", uuid: "962ce71a-789e-4bbf-858b-a31f54b62ece", description: "Its super soft,  but in the weirdest way possible?", rarity: "UNCOMMON", type: "MATERIAL", sources: ["Dusty Box", "Framed Chest"] },
    { id: 445, name: "LED Lights", uuid: "0e6971a3-322b-4b04-9127-7f82352a202a", description: "Illuminate your virtual world with LED Lights! Turn your pixel palace into a disco party.", rarity: "COMMON", type: "MATERIAL", sources: ["Disco Mats"] },
    { id: 460, name: "Four Leaf Clover", uuid: "8c86913e-c567-48bd-878c-dd2631455ae1", description: "A rare clover we picked out from a big wide open patch of flowers,  fit with lucky soil through and through", rarity: "COMMON", type: "MATERIAL", sources: ["Potion Supplies", "Assorted Goodie Bag", "Spring Leaves"] },
    { id: 461, name: "Lucky Fungus", uuid: "de0b86ab-7ddd-4c23-b938-e1d26459c228", description: "We found this on a log on the way to a pot of gold.", rarity: "COMMON", type: "MATERIAL", sources: ["Potion Supplies", "Assorted Goodie Bag", "Spring Leaves"] },
    { id: 497, name: "Wooden Spoon", uuid: "f6644644-0f45-4de9-95dc-c508bf572751", description: "It's a wooden spoon. You probably already know what to do with it - stir things.", rarity: "COMMON", type: "TOOL", sources: ["Chicken", "Potion Supplies", "Alien Food Pouch", "Soup's Goodies"] },
    { id: 499, name: "Josh's Support Tincture", uuid: "6003b51a-8a96-4be9-b72a-a9f66f779494", description: "Hmm… looks like drinking this potion will get Josh Isn’t Gaming to show me some love in his next video", rarity: "RARE", type: "MATERIAL", sources: [] },
    { id: 500, name: "Josh's Discord Brew", uuid: "75f3584a-b4c7-4098-9968-86eef0e97e08", description: "Hmm.. looks like drinking this potion will give me a role in the Josh Isn’t Gaming Discord server", rarity: "RARE", type: "MATERIAL", sources: [] },
    { id: 501, name: "Empty Potion Bottle", uuid: "45863b00-2a72-4c2d-950c-9647d4749597", description: "To hold all your potion endeavors", rarity: "UNCOMMON", type: "MATERIAL", sources: ["Potion Supplies"] },
    { id: 506, name: "OG Wizzy Hat", uuid: "85ef6168-91bf-4847-80b1-4d24a7664bd7", description: "Ahh,  the nostalgia", rarity: "RARE", type: "ACCESSORY", sources: ["JoshIsn't Crate"] },
    { id: 542, name: "Winged Helm", uuid: "309a3e73-953e-4b39-b167-0e5208f1c878", description: "It’s got a name that’ll make your friends do a double-take and wonder if you just sneezed or discovered an ancient artifact,  so we shortened it for ya.", rarity: "RARE", type: "ACCESSORY", sources: [] },
    { id: 546, name: "Feather", uuid: "e5e02581-1ccd-4caf-92f7-e20b8970e079", description: "Totally not just bird dandruff. Mix with other junk to make stuff you probably don't need.", rarity: "UNCOMMON", type: "MATERIAL", sources: ["Framed Chest", "Disco Mats", "Dusty Box"] },
    { id: 558, name: "Raw Moonstone", uuid: "3aaf05aa-a961-4bac-b614-2babb1b6986b", description: "So our shady geological guy swears he sourced these glowing fragments \"legally\" during a late night mining op ...suuure,  Keith 🙄. Anyway,  keep this on the DL in case the feds start sniffing around askin' questions about missing moon matter.", rarity: "UNCOMMON", type: "MATERIAL", sources: [] },
]

/**
 * Recipes that can be crafted
 * Properties:
 * result: the name of the item that is crafted
 * ingredients: array of item names required to craft the item
 * tools: array of tools required to craft the item
 * type: Name may change. Used for noting if the recipe is a seasonal recipe, a partnership, etc.
 */
const recipes = [
    { result: "", ingredients: [], tools: [], type: "" },
    { result: "Wizard Hat", ingredients: ["Minor Magic Potion", "Smooth Silk"], tools: [], type: "" },
    { result: "Smooth Silk", ingredients: ["White Fabric", "Two Blue Coins"], tools: [], type: "" },
    { result: "Minor Magic Potion", ingredients: ["Slightly Magical Fruit", "Empty Bottle"], tools: [], type: "" },
    { result: "Star Sickle", ingredients: ["Starlight Alloy", "Polished Blue Gem", "Polished Red Gem"], tools: ["Hammer"], type: "" },
    { result: "Blue Space Mask", ingredients: ["Crumpled Metal", "Nebula Orb", "Polished Blue Gem"], tools: ["Star Sickle"], type: "" },
    { result: "Red Space Mask", ingredients: ["Crumpled Metal", "Nebula Orb", "Polished Red Gem"], tools: ["Star Sickle"], type: "" },
    { result: "Sewing Needle", ingredients: ["Crumpled Metal", "Old Thread"], tools: [], type: "" },
    { result: "Nebula Orb", ingredients: ["Two Gold Coins", "Uncut Nebula"], tools: [], type: "" },
    { result: "Starlight Alloy", ingredients: ["Uncut Nebula", "Green Gem", "Stardust"], tools: [], type: "" },
    { result: "3-D Glasses", ingredients: ["Vinyl Sheet", "Red Lens", "Blue Lens"], tools: ["Hammer"], type: "" },
    { result: "Circuit", ingredients: ["Gold Orb", "Electricity", "Iron Plate"], tools: ["Hammer"], type: "" },
    { result: "Mr. Man", ingredients: ["Smooth Silk", "Yin Yang", "Anatomical Heart"], tools: [], type: "" },
    { result: "Red Button", ingredients: ["Electricity", "Magnet", "Circuit"], tools: ["Hammer"], type: "" },
    { result: "Hard Hat", ingredients: ["Electricity", "Iron Plate"], tools: ["Hammer"], type: "" },
    { result: "Iron Plate", ingredients: ["Crumpled Metal", "Strange Cloth"], tools: ["Hammer"], type: "" },
    { result: "Polished Moonstone", ingredients: ["Stardust", "Raw Moonstone"], tools: ["Hammer", "Craftsman Blade"], type: "" },
    { result: "", ingredients: [], tools: [], type: "" },
    { result: "Skull", ingredients: ["Monster Eye", "Haunted Bone"], tools: [], type: "Seasonal (Halloween)" },
    { result: "Spooky Hat", ingredients: ["Smooth Silk", "Jack-O-Lantern", "Skull"], tools: ["Sewing Needle"], type: "Seasonal (Halloween)" },
    { result: "Witch's Hat", ingredients: ["Spooky Hat", "Skull Potion", "Shadow Essence"], tools: ["Sewing Needle"], type: "Seasonal (Halloween)" },
    { result: "Jack-O-Lantern", ingredients: ["Pumpkin", "Candle"], tools: ["Craftsman Blade"], type: "Seasonal (Halloween)" },
    { result: "Skull Potion", ingredients: ["Empty Bottle", "Haunted Bone", "Skull"], tools: ["Witch's Cauldron"], type: "Seasonal (Halloween)" },
    { result: "Puff", ingredients: ["Smooth Silk", "Skull Potion", "Shadow Essence"], tools: ["Sewing Needle", "Witch's Cauldron"], type: "Seasonal (Halloween)" },
    { result: "", ingredients: [], tools: [], type: "" },
    { result: "Perfect Tree", ingredients: ["Tree Star", "Perfect Snowflake", "Decorated Tree"], tools: [], type: "Seasonal (Christmas)" },
    { result: "Mystical Ornament", ingredients: ["Yellow Ornament", "Red Bow", "Twinkling Lights"], tools: ["Holiday Magic Orb"], type: "Seasonal (Christmas)" },
    { result: "Perfect Snowflake", ingredients: ["Snowball (small)", "Cup of Cocoa", "Snowball (large)"], tools: ["Holiday Magic Orb"], type: "Seasonal (Christmas)" },
    { result: "Santa Hat", ingredients: ["Tree Star", "Perfect Snowflake", "Mystical Ornament"], tools: ["Holiday Magic Orb"], type: "Seasonal (Christmas)" },
    { result: "Decorated Tree", ingredients: ["Red Ornament", "Green Stocking", "Snowy Tree"], tools: [], type: "Seasonal (Christmas)" },
    { result: "Snowy Tree", ingredients: ["Snowball (small)", "Snowball (large)", "Winter Tree"], tools: [], type: "Seasonal (Christmas)" },
    { result: "Red Gift Cap", ingredients: ["Strawberry Bon Bon", "Red Present"], tools: ["Craftsman Blade"], type: "Seasonal (Christmas)" },
    { result: "Blue Gift Cap", ingredients: ["Blueberry Bon Bon", "Blue Present"], tools: ["Craftsman Blade"], type: "Seasonal (Christmas)" },
    { result: "Green Gift Cap", ingredients: ["Kiwi Bon Bon", "Green Present"], tools: ["Craftsman Blade"], type: "Seasonal (Christmas)" },
    { result: "Rudolph Toy", ingredients: ["Perfect Snowflake", "Rudolph's Nose"], tools: ["Holiday Magic Orb", "Fairy Particles"], type: "Seasonal (Christmas)" },
    { result: "Snowman Toy", ingredients: ["Perfect Snowflake", "Carrot"], tools: ["Fairy Particles"], type: "Seasonal (Christmas)" },
    { result: "", ingredients: [], tools: [], type: "" },
    { result: "Crown", ingredients: ["Tiny Crown", "Tiny Tiara", "Star Hat"], tools: [], type: "Seasonal (New Years 2024)" },
    { result: "Elite Party Hat", ingredients: ["Purple Party Hat", "Blue Party Hat", "Red Party Hat"], tools: [], type: "Seasonal (New Years 2024)" },
    { result: "", ingredients: [], tools: [], type: "" },
    { result: "Lantern Hat", ingredients: ["Firecracker", "Fortune", "Lucky Coin"], tools: [], type: "Seasonal (Lunar New Year)" },
    { result: "", ingredients: [], tools: [], type: "" },
    { result: "Shiny Heart", ingredients: ["Golden Heart", "Heart Coin"], tools: [], type: "Seasonal (Valentines)" },
    { result: "Heart Stack", ingredients: ["Shiny Heart", "Mini Heart", "Heart Coin"], tools: [], type: "Seasonal (Valentines)" },
    { result: "Heart Headband", ingredients: ["Heart Tophat", "Mini Heart"], tools: ["Craftsman Blade"], type: "Seasonal (Valentines)" },
    { result: "", ingredients: [], tools: [], type: "" },
    { result: "Blue Bonnet", ingredients: [" Gem", "Sprout"], tools: ["Watering Can"], type: "Seasonal (Spring)" },
    { result: "Red Bonnet", ingredients: [" Gem", "Sprout"], tools: ["Watering Can"], type: "Seasonal (Spring)" },
    { result: "Purple Bonnet", ingredients: [" Gem", "Sprout"], tools: ["Watering Can"], type: "Seasonal (Spring)" },
    { result: "Blue Flower Pot", ingredients: ["Garden Pot", "Blue Bonnet", "Fertilizer"], tools: ["Garden Shovel"], type: "Seasonal (Spring)" },
    { result: "Red Flower Pot", ingredients: ["Garden Pot", "Red Bonnet", "Fertilizer"], tools: ["Garden Shovel"], type: "Seasonal (Spring)" },
    { result: "Purple Flower Pot", ingredients: ["Garden Pot", "Purple Bonnet", "Fertilizer"], tools: ["Garden Shovel"], type: "Seasonal (Spring)" },
    { result: "Flower Crown", ingredients: ["Blue Flower Pot", "Red Flower Pot", "Purple Flower Pot"], tools: [], type: "Seasonal (Spring)" },
    { result: "", ingredients: [], tools: [], type: "" },
    { result: "Gold Horseshoe", ingredients: ["Gold Charm", "Lucky Coin", "Horseshoe Charm"], tools: [], type: "Seasonal (St. Patrick's Day)" },
    { result: "24k Clover Crown", ingredients: ["Gold Charm", "Lucky Coin", "Quad Luck Crown"], tools: [], type: "Seasonal (St. Patrick's Day)" },
    { result: "", ingredients: [], tools: [], type: "" },
    { result: "Josh's Support Tincture", ingredients: ["Lucky Fungus", "Prismatic Dust", "Empty Potion Bottle"], tools: ["Wooden Spoon"], type: "Partnership (Josh Isn't Gaming)" },
    { result: "Josh's Discord Brew", ingredients: ["Four Leaf Clover", "Prismatic Dust", "Empty Potion Bottle"], tools: ["Wooden Spoon"], type: "Partnership (Josh Isn't Gaming)" },
    { result: "Mithril Helmet", ingredients: ["Polished Blue Gem", "Iron Plate", "Steel Med"], tools: ["Hammer"], type: "Partnership (Josh Isn't Gaming)" },
    { result: "", ingredients: [], tools: [], type: "" },
    { result: "Bucket of Magic Glue", ingredients: ["Branch", "Wooden Plank"], tools: ["Wooden Spoon", "Fairy Particles"], type: "Partnership (Alien Food)" },
    { result: "Zerk Helm", ingredients: ["Iron Plate", "Electricity", "Wooden Plank"], tools: ["Hammer"], type: "Partnership (Alien Food)" },
    { result: "", ingredients: [], tools: [], type: "" },
    { result: "Gold Spell Cap", ingredients: ["Gold Thread", "Strange Cloth"], tools: ["Sewing Needle", "Fairy Particles"], type: "Partnership (Framed)" },
    { result: "Zerk Mask", ingredients: ["Crumpled Metal", "Shadow Essence", "Iron Plate"], tools: ["Hammer"], type: "Partnership (Framed)" },
    { result: "Winged Helm", ingredients: ["Gold Orb", "Iron Plate", "Feather"], tools: ["Hammer"], type: "Partnership (Framed)" },
    { result: "Status Skull", ingredients: ["Haunted Bone", "Skull Potion"], tools: ["Witch's Cauldron"], type: "Partnership (Framed)" },
    { result: "", ingredients: [], tools: [], type: "" },
    { result: "Dragon Helm", ingredients: ["Polished Red Gem", "Red Party Hat", "Iron Plate"], tools: ["Hammer"], type: "Partnership (SoupRS)" },
    { result: "Blue Halo", ingredients: ["Stardust", "Polished Moonstone", "Prismatic Dust"], tools: ["Witch's Cauldron"], type: "Partnership (SoupRS)" },
    { result: "Banana Hat", ingredients: ["Strange Cloth", "Banana"], tools: ["Sewing Needle"], type: "Partnership (SoupRS)" },
    { result: "Purple Flame Hat", ingredients: ["Starlight Alloy", "Wooden Log", "Electricity"], tools: ["Lighter"], type: "Partnership (SoupRS)" },
    { result: "Bowl of Soup", ingredients: ["Soup Can", "Salt & Pepper"], tools: ["Wooden Spoon"], type: "Partnership (SoupRS)" },
    { result: "", ingredients: ["", ""], tools: [], type: "" },
]

/**
 * Classes that are used to find elements on the page
 * name: the name of the class
 * class: the class name
 */
const targetClasses = [
    { name: "Inventory", class: ".cfWcg" },
    { name: "Selected Item Window", class: "._base_1h3kk_1" },
    { name: "Selected Item Details", class: "._base_awewl_1" },
    { name: "Moonbounce Portal Buttons", class: "._base_11wdf_1" },
    { name: "Source List Item", class: ".mSsVp" },
]
const getTargetClass = name => targetClasses.find(x => x.name == name).class;




// ███╗   ███╗ █████╗ ██╗███╗   ██╗
// ████╗ ████║██╔══██╗██║████╗  ██║
// ██╔████╔██║███████║██║██╔██╗ ██║
// ██║╚██╔╝██║██╔══██║██║██║╚██╗██║
// ██║ ╚═╝ ██║██║  ██║██║██║ ╚████║
// ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝

// continuously call addCopyUUIDToItemImage every second
setInterval(addCopyDetailstoItemImage, 1000);





// ███████╗██╗   ██╗███╗   ██╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗
// ██╔════╝██║   ██║████╗  ██║██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
// █████╗  ██║   ██║██╔██╗ ██║██║        ██║   ██║██║   ██║██╔██╗ ██║███████╗
// ██╔══╝  ██║   ██║██║╚██╗██║██║        ██║   ██║██║   ██║██║╚██╗██║╚════██║
// ██║     ╚██████╔╝██║ ╚████║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║███████║
// ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝

/**
 * Add an event listener to item images that copies the item's UUID to the clipboard
 * If ctrl is held, also copy the item's name and ID
 */
function addCopyDetailstoItemImage() {
    let itemWindow = findSelectedItemWindow();
    if (itemWindow == null) return;

    let items = itemWindow.querySelectorAll("img");
    if (items.length == 0) return;

    let details = itemWindow.querySelector(getTargetClass("Selected Item Details"));

    function getUUIDFromSrc(src) {
        let start = src.indexOf("/fp/") + 4;                                // find the index of /fp/ and add 4 to get the start of the uuid
        let end = src.indexOf("/c/");                                       // find the index of /c/ to get the end of the uuid
        let uuid = src.substring(start, end);                               // get the substring between the start and end

        return uuid;
    }

    function getDetails(details) {
        let nameIdBlock = details.children[0];                                  // get the first child of the details element
        let name = nameIdBlock.children[0].innerText;                           // get the text of the first child (the name)
        let id = nameIdBlock.children[1].innerText;                             // get the text of the second child (the id)
        id = id.substring(1);                                                   // remove the # from the beginning of the id

        let info = details.children[1];                                         // get the second child of the details element
        let description = info.children[0].innerText;                           // get the text of the first child (the description)
        let rarity = info.children[1].children[0].innerText;                    // get the text of the first child of the second child (the rarity)
        let type = info.children[1].children[1].innerText;                      // get the text of the second child of the second child (the type)

        let sources = details.children[2];                                      // get the third child of the details element
        let sourceObjects = sources.querySelectorAll(getTargetClass("Source List Item"));
        // get the p from each source object and add it to the source list
        let sourceList = [];
        for (let source of sourceObjects) {
            let p = source.querySelector("p");
            sourceList.push(p.innerText);
        }

        return { name: name, id: id, description: description, rarity: rarity, type: type, sources: sourceList };
    }

    function cleanJSONString(jsonString, id) {
        const keys = ["id", "name", "uuid", "description", "rarity", "type", "sources"];

        jsonString = jsonString.replace(/:/g, ": ");                        // replace all instances of ":" with ": "
        jsonString = jsonString.replace(/,/g, ", ");                        // replace all instances of "," with ", "
        jsonString = jsonString.replace(/{/g, "{ ");                        // replace all instances of "{" with "{ "
        jsonString = jsonString.replace(/}/g, " }");                        // replace all instances of "}" with " }"
        // remove quotes from the keys
        for (let key of keys) {
            jsonString = jsonString.replace(`"${key}"`, key);               // Replace the key string with just the key
        }
        jsonString = jsonString.replace(`"${id}"`, id);                     // Replace the id string with just the id

        return jsonString;
    }

    for (let item of items) {
        // If the item is not an item image, skip it
        if (item.alt != "item") continue;

        // if the item has an event listener, skip it
        if (item.classList.contains("item-uuid-event")) continue;

        console.log("Adding event listener to item");

        // add an event listener to the item's parent
        item.parentElement.addEventListener("click", function () {
            let img = this.querySelector("img");
            let uuid = getUUIDFromSrc(img.src);                             // get the item's UUID from the image source

            // also get the item name and id, and format it as
            // { id: "item id", name: "item name", uuid: "item uuid" }
            console.log("Copying item info to clipboard");

            let { name, id, description, rarity, type, sources } = getDetails(details);

            let itemInfo = { id: id, name: name, uuid: uuid, description: description, rarity: rarity, type: type, sources: sources };
            let jsonString = JSON.stringify(itemInfo);                  // convert the object to a JSON string

            jsonString = cleanJSONString(jsonString, id);               // Clean up the JSON string
            jsonString += ",";                                          // Add a comma to the end of the string

            copyToClipboard(jsonString);
        });

        // add a class to the item to show that it has an event listener
        item.classList.add("item-uuid-event");
    }
}





// ██╗  ██╗███████╗██╗     ██████╗ ███████╗██████╗ 
// ██║  ██║██╔════╝██║     ██╔══██╗██╔════╝██╔══██╗
// ███████║█████╗  ██║     ██████╔╝█████╗  ██████╔╝
// ██╔══██║██╔══╝  ██║     ██╔═══╝ ██╔══╝  ██╔══██╗
// ██║  ██║███████╗███████╗██║     ███████╗██║  ██║
// ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝

/**
 * Find the inventory on the page
 * @returns the inventory div element | null
 */
function findInventory() {
    // find the inventory div
    let inventory = document.querySelector(getTargetClass("Inventory"));
    if (inventory == null) return;

    return inventory;
}

/**
 * Find the selected item window on the page
 * @returns the selected item window div | null
 */
function findSelectedItemWindow() {
    // find the selected item window
    let selectedItemWindow = document.querySelector(getTargetClass("Selected Item Window"));
    if (selectedItemWindow == null) return;

    return selectedItemWindow;
}


/**
 * Find the Moonbounce Portal on the page
 */
function findMoonbouncePortal() {
    // find #MOONBOUNCE.PORTAL
    let portal = document.querySelector("#MOONBOUNCE.PORTAL");
    if (portal == null) return;

    return portal;
}


/**
 * Find the Moonbounce Portal buttons on the page
 */
function findMoonbouncePortalButtons() {
    let portal = findMoonbouncePortal();
    if (portal == null) return;

    // find the buttons
    let buttons = portal.querySelector(getTargetClass("Moonbounce Portal Buttons"));
    if (buttons == null) return;

    return buttons;
}

/**
 * Copy text to the clipboard
 * @param {string} text the text to copy
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
}