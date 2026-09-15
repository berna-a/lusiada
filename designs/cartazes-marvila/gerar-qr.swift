import AppKit
import CoreImage
import Foundation

let context = CIContext(options: [.useSoftwareRenderer: false])
let detector = CIDetector(
    ofType: CIDetectorTypeQRCode,
    context: context,
    options: [CIDetectorAccuracy: CIDetectorAccuracyHigh]
)

if CommandLine.arguments.count == 4 && CommandLine.arguments[1] == "--verificar" {
    let file = URL(fileURLWithPath: CommandLine.arguments[2])
    let address = CommandLine.arguments[3]
    guard let image = CIImage(contentsOf: file),
          let decoded = detector?.features(in: image).compactMap({ ($0 as? CIQRCodeFeature)?.messageString }),
          decoded.contains(address) else {
        fputs("O QR do cartaz não foi verificado.\n", stderr)
        exit(1)
    }
    print(address)
    exit(0)
}

guard CommandLine.arguments.count == 3 else {
    fputs("Uso: swift gerar-qr.swift URL ficheiro.png\n", stderr)
    exit(2)
}

let address = CommandLine.arguments[1]
let output = URL(fileURLWithPath: CommandLine.arguments[2])
let generator = CIFilter(name: "CIQRCodeGenerator")!
generator.setValue(Data(address.utf8), forKey: "inputMessage")
generator.setValue("H", forKey: "inputCorrectionLevel")
guard let image = generator.outputImage else { exit(1) }

let scaled = image.transformed(by: CGAffineTransform(scaleX: 12, y: 12))
guard let cgImage = context.createCGImage(scaled, from: scaled.extent) else { exit(1) }
let bitmap = NSBitmapImageRep(cgImage: cgImage)
guard let png = bitmap.representation(using: .png, properties: [:]) else { exit(1) }
try png.write(to: output)

let decoded = detector?.features(in: image).compactMap { ($0 as? CIQRCodeFeature)?.messageString }
guard decoded == [address] else {
    fputs("O QR gerado não foi verificado.\n", stderr)
    exit(1)
}
print(decoded![0])
