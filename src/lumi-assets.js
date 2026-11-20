/* Kit art format.
   The source tree keeps the PNG originals so browser runs and art tools need
   no conversion. The release pipeline converts the packaged 128 px kit sheets
   and thumbs to lossless WebP and sets window.LUMI_KIT_EXT before this file
   runs; everything else keeps the PNG path. */
(function () {
  var ext = (typeof window !== 'undefined' && window.LUMI_KIT_EXT === 'webp') ? 'webp' : 'png';
  window.LUMI_KIT_EXT = ext;
  window.lumiKitAsset = function (slot, name) {
    return 'assets/lumi/kits/' + slot + '/' + name + '.' + ext;
  };
})();