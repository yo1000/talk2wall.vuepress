---
title: Kotlin でヒアドキュメント中の文字をエスケープをする
date: 2018-08-10T15:50:00+09:00
tags:
- kotlin
- spring
- spring-boot
- spel
requirements:
- Java 8
- Kotlin 1.2.41
references:
- http://kotlinlang.org/docs/reference/basic-types.html#string-templates
overview: "
Kotlin には変数展開機能があるため、`$` 記号を使いたい場合エスケープが必要になる。
ヒアドキュメントと通常の文字列でエスケープの方法が少し異なり、クセがあるのでメモ。
"
---

## デモ
通常の文字列内でのエスケープ

```kotlin
println("\${xyz}") // OK: ${xyz}
```

ヒアドキュメント内でのエスケープ

```kotlin
println("""
\${xyz}
""".trimIndent()) // NG: Compile ERROR

println("""
\$\{xyz\}
""".trimIndent()) // NG: \$\{xyz\}

println("""
${'$'}{xyz}
""".trimIndent()) // OK: ${xyz}

val doller: Char = '$';
println("""
${doller}{xyz}
""".trimIndent()) // OK: ${xyz}
```

`Char` 型の値として変数展開させた文字をくっつけて使う、というわけですね。どうしてヒアドキュメントだけエスケープ仕様違うんだろう🤔

Spring の SpEL 等では Kotlin での変数展開同様に、`$` 記号がキーワードとして使われるため、この書き方は覚えておくとよさそう。

